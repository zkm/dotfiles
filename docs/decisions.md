# Decision log / rationale

Non-obvious choices and why they're the way they are, so they don't get
"fixed" back to the more obvious-looking alternative. Grounded in code
comments and commit history — where the historical record doesn't give a
reason, that's noted rather than invented.

## Fonts differ per terminal, and Windows/WSL specifically needs a real Nerd Font {#fonts-per-terminal}

- `config/wezterm` uses JetBrains Mono with an explicit font-fallback list,
  so a non-Nerd primary font still degrades gracefully for icon glyphs.
- `config/alacritty/alacritty.toml` (Linux/macOS) and
  `config/alacritty/windows-wsl.toml` (Windows-native launching into WSL)
  have no fallback list available (Alacritty doesn't support one), so the
  primary font itself must be Nerd-Font-patched. `windows-wsl.toml` was
  changed from JetBrains Mono to MesloLGS NF for exactly this reason
  (commit `499c7441`) — see [[gotchas]] for the full debugging story. Don't
  swap it back to a non-patched font without adding wezterm-style fallback
  support to Alacritty first (which doesn't exist as of this writing).

## `mise` replaced `nvm`/pyenv-as-Node-manager, but pyenv/rbenv stick around for other roles

Commit `0de6002f` ("Remove nvm now that mise manages Node") removed `nvm`
once `mise` (via `config/mise/config.toml`: `node = "26"`, `python =
"3.14"`, plus `awscli`/`claude`/`gh`/`glab`) covered that need. `pyenv` and
`rbenv` are still installed by the package-manager functions and initialized
in `zshrc` (guarded by `__PYENV_INIT_DONE`/`__RBENV_INIT_DONE` sentinels) —
they haven't been fully subsumed by `mise`, so both toolchains are live at
once. If asked to "just use mise for everything," check whether pyenv/rbenv
are still doing work (e.g. building CPython via the dnf/yum
`openssl-devel`/`bzip2-devel`/... dev packages installed alongside them)
before removing them.

`mise activate zsh` is the one version-manager init in `zshrc` **without**
an `__INIT_DONE` guard — deliberate, per the inline comment, because `mise
activate` is documented as idempotent, unlike pyenv/rbenv's `init -`
commands which aren't safe to eval twice per shell.

## Starship is the default prompt; Powerlevel10k is opt-in, not removed

`PROMPT_BACKEND` defaults to `starship` and only switches to `p10k` when
explicitly set (`PROMPT_BACKEND=p10k`). Powerlevel10k support (cloning,
`~/.p10k.zsh`, the zshrc branch that sources it) is fully maintained, not a
deprecated leftover — `setup_p10k()` in `setup.sh` still actively clones
`~/.powerlevel10k` and wires the source line when requested. Commit
`eaaa13f3` ("adding starship") predates this being the default; treat
starship as the actively-developed path (see `bdec36ae` "icon candy via
starship" for the most recent prompt-icon work) but don't strip p10k support
without checking whether the user still wants that opt-in path.

## Fish shell was removed once, then genuinely re-added {#fish-shell-support}

Commits `b32df95a` ("Adding the option to choose bash, zsh, fish") →
`abb9d63a`/`cb3fbc22` ("no fish for you" / "So long and thanks for all of
the fish") show fish was added as a third `SHELL_MODE` option and then
completely removed (setup.sh support, `config/fish/config.fish`, the
starship fish-specific line). Neither commit message states a reason.

Fish came back for real on 2026-09-08, prompted by a fresh CachyOS+Hyprland
install whose account's login shell was already fish (`getent passwd`
showed `/bin/fish`) — running `setup.sh` unmodified would have silently
`chsh`'d it to bash, since `detect_current_shell_mode()` only recognized
`*/zsh` and fell through to `"bash"` for anything else. Fixed properly
rather than patched around:

- `detect_current_shell_mode()` recognizes `*/fish` and the interactive
  menu (`shell_mode_prompt_decision`) offers `3) fish` as a real, selectable
  target — not just "leave it alone if already fish". `SHELL_MODE=fish` env
  var works the same as `bash`/`zsh`.
- `setup_shell()`'s `fish)` case actually `chsh`'s to fish when selected and
  the current shell isn't already fish (mirrors the bash/zsh branches
  exactly — no more special-cased no-op).
- `should_use_fish()` (mirrors `should_use_zsh()`) gates a `fish` package
  add-on in every `install_with_*`/Homebrew function.
- `config/fish/` is a full hand-ported translation of `aliases`/
  `zshrc`/`bashrc` — see [[file-map#config-fish]] for the layout. Every
  function/complex alias in `aliases` was translated and syntax-checked
  with `fish -n`; the multi-function ones (`navidrome-cleanup-duplicates`,
  `navidrome-rebuild-playlists`, `raidview`) were also exercised against
  synthetic test data (temp directories, fake `$detail`/`$df_line` blobs) to
  catch fish-specific gotchas that don't show up as syntax errors — e.g.
  `read -r` isn't valid in fish (`-r` doesn't exist, breaks the read
  entirely), quoting a fish list variable joins it with spaces not
  newlines (`"$listvar"` in a filter pipeline silently searches the wrong
  text), and `"${$var}suffix"`-style bash suffix-concatenation greedily
  swallows the suffix into the variable name unless split into adjacent
  quoted segments. The remote-SSH payloads inside the two `navidrome-*`
  functions are still literally bash (executed on the remote host, not
  fish) and were verified byte-identical to the original by rendering them
  through a fake `ssh` function rather than guessed at — not
  live-tested against a real remote host.
- `raidview`'s RAID-detail-parsing branch (the part that needs a real
  `/dev/mdX` array) could only be sanity-checked piecewise with synthetic
  `mdadm --detail`-shaped text, not run end-to-end — there's no RAID
  hardware on the machine this was written on.
- One pre-existing bash bug was found and *not* replicated: the original
  `navidrome-rebuild-playlists`' local-path branch pipes `find | while
  read; do ... done`, which runs in a subshell in bash — so `rebuilt`/
  `skipped` counters reset outside the loop and the final summary always
  printed "0 playlists, skipped 0" regardless of real counts. Fish doesn't
  run piped `while` loops in a subshell, so the fish version reports real
  counts. The bash version was left as-is (out of scope to fix here) but
  don't be surprised if the two disagree on that one line.

Hyprland followed the same arc once (`177500f1` → `56d4f081` "removed
hyprland", which deleted `config/hypr/`, Hyprland-specific `setup.sh`
install steps, and trimmed `config/waybar`) but was reintroduced in
2026-09-08 — see the next entry. That earlier removal was of a hand-rolled
Hyprland config with its own package-install path; don't use it as a
template for the current reference-only approach.

## Hyprland config is a reference-only snapshot, not repo-managed {#hyprland-reference-only}

`config/hypr` holds a copy of CachyOS's *stock default* Hyprland config
(installed on a fresh CachyOS+Hyprland system, dual-booted with Windows —
added 2026-09-08). Unlike the old, fully hand-rolled `config/hypr/` that was
removed in `56d4f081`, this one is deliberately **not** wired into
`setup.sh`/`uninstall.sh` at all — no `link_repo_config_path` call, no
`INSTALL_HYPRLAND` env var, no package-install function. Reason: CachyOS
owns and updates this config via its own packages (it uses CachyOS's
Lua-based `hyprland.lua`/`config/*.lua` module system, not a plain
`hyprland.conf`), so symlinking it from the repo would fight package
upgrades — the exact problem that got KDE Plasma config pulled from this
repo entirely (see [[subsystems#kde-plasma-configs-unmanaged]]). Keep it
copy-in/copy-out, the same pattern already used for `config/GIMP`: edit
`~/.config/hypr` live, then manually copy changed files back into
`config/hypr` to keep the snapshot current. Don't add automation here
without re-confirming with the user first — this was an explicit choice
after discussing the fresh-install/dual-boot risk, not an oversight to
"complete."

## `clear_old_dotfiles` unconditionally deletes real files — this is intentional, not a bug

Already called out prominently in `CLAUDE.md`, repeated here because it's
the single most consequential design decision in this repo and the most
likely thing a future session might "helpfully" try to make safer. It
`rm -f`/`rm -rf`s real files at well-known `$HOME` targets *before*
recreating them as symlinks, unconditionally, every run. `uninstall.sh` is
the deliberately-safe counterpart (`remove_if_symlink_to_repo` only touches
paths that are actually symlinks resolving into this repo). Do not add
existence checks, backups, or confirmation prompts to
`clear_old_dotfiles()` — that would change documented, relied-upon behavior
(see README "Important behavior").

## Media tools (OpenRGB/REAPER) are opt-in/conditional, not default-on

`install_media_tools()` requires an explicit `INSTALL_MEDIA_TOOLS=1` (or the
per-tool `INSTALL_OPENRGB=1`/`INSTALL_REAPER=1`) and, per its own comment,
skips outright in non-interactive mode with none of those set rather than
prompting — an earlier interactive-prompt version was found to hang some
terminal emulators. This follows the general env-var-driven-optional-step
pattern in `CLAUDE.md`; preserve it for any new optional install step rather
than defaulting new opt-in features to on.

KDE Plasma dotfiles (`dolphinrc`, `kdeglobals`, etc.) were previously
auto-linked the same way (`is_kde_plasma_session`/`INSTALL_KDE_CONFIG`), but
that management was removed — see [[subsystems#kde-plasma-configs-unmanaged]]
— because those files churn too fast from live desktop state to track in
git.

## `opencode` install uses `--no-modify-path`

`install_opencode()` passes `--no-modify-path` to the opencode installer
specifically because that installer's default behavior is to append its own
`PATH` export directly to `~/.zshrc`/`~/.bashrc` — which in this repo are
symlinks back into the repo itself, and the `PATH` export is already present
in `zshrc`. Without this flag the installer would dirty a tracked,
symlinked file on every fresh install.
