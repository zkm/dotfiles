# Subsystem deep dives

`CLAUDE.md` gives a one-paragraph summary of each of these. This file goes
one level deeper for when work actually touches the subsystem. Keep
`CLAUDE.md`'s summaries as the index; put detail here.

## Shell config chain

Entry points: `~/.zshrc` → `zshrc` and `~/.bashrc` → `bashrc` (both
symlinked by `create_dotfiles` in `setup.sh`, only if the corresponding repo
file exists — `bashrc`/`bash_profile`/`bash_aliases` are optional, zsh is the
primary target).

`zshrc` load order (see `zshrc:1-186`):
1. Env vars + `PATH` (`typeset -U path PATH` keeps it deduped across
   re-sources; prepends `.local/bin`, `scripts`, composer vendor bin, rbenv,
   pyenv, bun).
2. `fastfetch` runs before the prompt backend loads, specifically to avoid
   p10k instant-prompt console-I/O warnings.
3. Prompt backend selector (`PROMPT_BACKEND`, default `starship`): loads
   p10k's instant-prompt cache + theme + `~/.p10k.zsh`, or `starship init
   zsh`, or (fallback branch) p10k anyway if starship isn't on PATH. See
   [[decisions#starship-vs-p10k]].
4. `dircolors -b ~/.dotfiles/dircolors` (note: hardcoded path, not
   `~/.dircolors` — see caveat below).
5. `source ~/.aliases`.
6. `compinit`, cached via a same-day zcompdump check (`EPOCHSECONDS -
   zcompdump_mtime < 86400`) to keep startup fast; falls back to a fresh
   `compinit` otherwise.
7. Vi-mode keybindings (`bindkey -v`) plus a `zle-keymap-select` hook that
   prefixes the prompt with `[NORMAL]`/`[INSERT]` — but only when
   `PROMPT_BACKEND == starship` (p10k has its own native vi-mode indicator,
   so this would double up).
8. Version manager init, each guarded by a `__*_INIT_DONE` sentinel so
   re-sourcing `zshrc` (e.g. from a nested shell) doesn't redo `eval
   "$(pyenv init - zsh)"` / rbenv repeatedly: pyenv, rbenv inline; SDKMAN is
   lazy — `sdk()` is a wrapper function that sources
   `sdkman-init.sh` on first real invocation, not at shell startup.
9. `mise activate zsh` — **not** guarded by an `__INIT_DONE` sentinel,
   unlike the others, because `mise activate` is documented as idempotent.
   Manages Node/Python/other tool versions per `config/mise/config.toml`
   (currently: awscli, claude, gh, glab, node 26, python 3.14).

**Caveat:** `zshrc` sources `~/.dotfiles/dircolors` and falls back to
`~/.dotfiles/p10k.zsh` by hardcoded path in a couple of places, which
assumes the repo is cloned to exactly `~/.dotfiles`. `create_dotfiles`
itself is location-agnostic (`$REPO_ROOT` from `BASH_SOURCE`), but these
particular lines in `zshrc` are not — if the repo is ever cloned elsewhere,
these fallbacks silently do nothing (the primary `~/.dircolors`/`~/.p10k.zsh`
symlink paths still work fine since those come from `create_dotfiles`).

**Known dead code:** `zsh/configs/prompt.zsh` and
`zsh/configs/whole_line_completion.zsh` are not sourced by anything. See
[[gotchas#zsh-configs-dead-code]].

## Terminal emulator configs (`config/{alacritty,wezterm,ghostty,kitty}`)

Four terminal configs are maintained in parallel, all symlinked via
`link_repo_config_path` (only if their directory exists in the repo) except
`config/alacritty/windows-wsl.toml`, which is never symlinked by `setup.sh`
— it's Windows-native-app config, manually copied to
`%APPDATA%\alacritty\alacritty.toml` per its own header comment, since
`setup.sh` only runs inside Linux/macOS (including inside WSL, where it
manages `config/alacritty/alacritty.toml`, the Linux-side config used when
launching Alacritty *from* WSL rather than launching *into* WSL from
Windows).

Shared visual identity across all four: Tokyo Night-derived color palette
(`#1a1b26` background, `#c0caf5` foreground, `#bb9af7` cursor, etc. — same
hex values appear in `alacritty.toml`, `windows-wsl.toml`, and presumably
wezterm/ghostty/kitty configs, so a palette tweak needs to be applied in up
to 5 places: 4 real terminal configs + `config/starship.toml` for the
prompt's own accent colors, which use a related but not identical palette).

Font handling differs by terminal specifically because Alacritty has no
font-fallback list:
- `config/alacritty/alacritty.toml` and `windows-wsl.toml`: single
  `[font.normal/bold/italic]` family, must itself be Nerd-Font-patched
  (JetBrains Mono on Linux/macOS works because glyphs aren't hit as hard
  there / a system fallback covers it — MesloLGS NF on Windows/WSL is
  required, see [[gotchas]]).
- `config/wezterm`: has an explicit fallback font list, so a non-Nerd
  primary font degrades gracefully instead of breaking icon rendering.

## Prompt (`config/starship.toml`)

Two-line format via a literal `\n` in the `format` string (not via the
`$line_break` module — `[line_break] disabled = false` is set but
`$line_break` isn't referenced anywhere in `format`, so that setting
currently has no effect):
```
[╭─] $os$username$hostname$directory$git_branch$git_host$git_status$fill$cmd_duration
[╰─] $character
```
`right_format` pairs with the *second* line (`╰─ $character`), not the
first — it's rendered flush-right on the same visual row as `❯`, via
Starship's own cursor save/jump/print/restore sequence. `$fill` on line 1
pads with spaces out to the terminal's full reported width to right-align
`$cmd_duration`. Both of these are the two places in this config that
depend on an accurate terminal-width readout; see [[gotchas]] for what
*didn't* end up being the actual bug here, in case width-related prompt
issues come up again.

`custom.git_host` and `custom.banger` are shell-out modules
(`command = "..."`) evaluated on every prompt draw — `git_host` is gated by
`when`/`require_repo` so it only shells out inside a git repo;
`custom.banger` has `when = "true"`, i.e. it always runs
(`echo ${BANGERS:-''}`), reading a `BANGERS` env var the user sets
elsewhere to inject an ad hoc banner message into the right prompt.

## Aliases catalog (`aliases`, ~1170 lines)

Banner-delimited sections, in file order (grep `^# [emoji]` to relocate
these — banners use a consistent double-line `# ===` box):

| Section | Rough line range | Notes |
|---|---|---|
| Basic Commands | 11–18 | `c`, `l`/`ll`/`la` |
| eza (modern `ls`) | 19–48 | |
| Directory Shortcuts | 49–66 | |
| Editor Preferences | 67–98 | `unalias` block up front to strip Oh-My-Zsh/distro defaults for names this file redefines (`vim`, `neofetch`, `openrgb*`, `docker-*`, `plex-*`, etc.) before redefining them — if a new alias/function collides with a distro default, add its name to this `unalias` list rather than fighting shadowing bugs |
| Modern CLI Shortcuts (fd/rg/bat/kitty image helpers) | 99–198 | |
| System Info & Utilities | 199–419 | `neofetch()` wrapper prefers `fastfetch` |
| TMUX Management | 420–427 | |
| Git Shortcuts | 428–442 | |
| Music Library Management | 443–769 | Navidrome rsync/scan aliases |
| Docker | 770–960 | |
| Web Server Management (nginx) | 961–1028 | |
| CakePHP Development (Docker) | 1029–1035 | |
| Ollama (GPU + CPU) | 1036–1082 | Model management / quick shortcuts / direct model aliases / streaming / info / cleanup, as sub-`# ---` groups |
| RAID Management | 1083–1164 | `raidview()` — resolves the md device via `/proc/mdstat` first, falls back to `lsblk` scanning for a `raid5` type |
| OpenRGB lighting effects | 1165–1172 | |

When adding aliases, find the matching banner rather than appending at the
end — the file is read top-to-bottom by section, not alphabetically.

## KDE Plasma config linking

Gated by `is_kde_plasma_session()` (checks `XDG_CURRENT_DESKTOP`,
`DESKTOP_SESSION`, `KDE_FULL_SESSION`, `KDE_SESSION_VERSION`) or forced via
`INSTALL_KDE_CONFIG=1`. Links (as of this writing): `dolphinrc`,
`kcminputrc`, `kdeglobals`, `plasma-org.kde.plasma.desktop-appletsrc`,
`plasmanotifyrc`, `plasmarc`. See [[gotchas#setup-uninstall-drift]] for the
current mismatch with `uninstall.sh`'s KDE cleanup list.

## OpenRGB / REAPER (media tools)

Both opt-in and off by default (`INSTALL_MEDIA_TOOLS=1` for both,
`INSTALL_OPENRGB=1`/`INSTALL_REAPER=1` individually) — deliberately, per
`install_media_tools()`'s comment, to keep `setup.sh` safe to run on
shared/public machines without pulling in personal RGB/audio tooling. In
non-interactive mode with none of those env vars set, the step is skipped
outright rather than prompting (prompting was previously found to hang some
terminal emulators, per the code comment).
