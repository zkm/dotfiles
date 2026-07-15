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

## Fish shell and Hyprland were tried and fully removed, not just deprioritized

Commits `b32df95a` ("Adding the option to choose bash, zsh, fish") →
`abb9d63a`/`cb3fbc22` ("no fish for you" / "So long and thanks for all of
the fish") show fish was added as a third `SHELL_MODE` option and then
completely removed (setup.sh support, `config/fish/config.fish`, the
starship fish-specific line). Similarly, `56d4f081` ("removed hyprland")
deleted the entire `config/hypr/` tree, Hyprland-specific `setup.sh` steps,
and trimmed `config/waybar` to match. Neither commit message states a
reason. Treat both as settled subtractions (don't re-add fish as a
`SHELL_MODE` option or restore `config/hypr/` speculatively) but if the user
asks for either back, there's no documented blocker — it's just currently
unsupported, not deliberately forbidden.

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

## Media tools (OpenRGB/REAPER) and KDE config are opt-in/conditional, not default-on

`install_media_tools()` requires an explicit `INSTALL_MEDIA_TOOLS=1` (or the
per-tool `INSTALL_OPENRGB=1`/`INSTALL_REAPER=1`) and, per its own comment,
skips outright in non-interactive mode with none of those set rather than
prompting — an earlier interactive-prompt version was found to hang some
terminal emulators. KDE Plasma dotfiles are auto-linked only when a KDE
session is actually detected (`is_kde_plasma_session`), overridable via
`INSTALL_KDE_CONFIG`. Both follow the general env-var-driven-optional-step
pattern in `CLAUDE.md`; preserve it for any new optional install step rather
than defaulting new opt-in features to on.

## `opencode` install uses `--no-modify-path`

`install_opencode()` passes `--no-modify-path` to the opencode installer
specifically because that installer's default behavior is to append its own
`PATH` export directly to `~/.zshrc`/`~/.bashrc` — which in this repo are
symlinks back into the repo itself, and the `PATH` export is already present
in `zshrc`. Without this flag the installer would dirty a tracked,
symlinked file on every fresh install.
