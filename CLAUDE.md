# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Personal dotfiles (Bash/Zsh, Git, tmux, kitty/wezterm/ghostty, KDE/GTK theming, OpenRGB, REAPER) for Linux (mainly Arch, but also Fedora/Debian/Ubuntu/RHEL/Gentoo) and macOS. `setup.sh` symlinks files from this repo into `$HOME`; `uninstall.sh` reverses it. Neovim config lives in a separate repo (`zkm/nvim-config`), not here.

## Commands

Lint (matches CI in `.github/workflows/ci.yml`):
```sh
shellcheck --severity=error setup.sh
bash -n setup.sh
```
There is no test suite; CI only lints/syntax-checks `setup.sh`. When editing other shell scripts (`uninstall.sh`, `local/bin/*.sh`, `zsh/configs/*.zsh`), run `shellcheck` and `bash -n`/`zsh -n` on them manually too, since CI doesn't cover them.

Try setup/uninstall changes in a disposable environment (container or VM) before assuming they're safe — see "Destructive behavior" below.

## Architecture

**Install flow (`setup.sh`):** single script, no external config file. Order matters:
1. `clear_old_dotfiles` deletes real files at well-known `$HOME` targets (see below) — this always runs first, unconditionally.
2. `create_dotfiles` / `create_alias_directories` / `sync_custom_desktop_assets` symlink repo files into `$HOME` (or copy, for icons/wallpapers/fonts) — done early so the shell stays usable even if later steps fail.
3. Package installation branches by OS/package manager: `install_with_pacman`, `install_with_apt`, `install_with_dnf`, `install_with_yum`, `install_with_emerge`, or the macOS `install_homebrew*` path. Each Linux path is independently maintained (Arch is the primary target; others are best-effort with per-package fallbacks).
4. Remaining steps (fonts, terminal, browsers, VS Code, Docker, media tools) run via `run_nonfatal "<label>" <fn>` so a single failure doesn't abort the whole install. When adding a new setup step, wrap it in `run_nonfatal` unless it's a genuine hard prerequisite.

**Shell config chain:** `zshrc` sources `~/.aliases` (→ `aliases` in repo), `zsh/configs/*.zsh` (prompt, completion), and `dircolors`. `PROMPT_BACKEND` env var (default `starship`, opt-in `p10k`) selects the prompt; Powerlevel10k is only cloned/sourced when explicitly requested via `PROMPT_BACKEND=p10k`. Version managers (`pyenv`, `rbenv`, `nvm`, `sdkman`) are guarded with `__*_INIT_DONE` sentinels to avoid duplicate init on re-source, and `sdk` is lazy-loaded on first call rather than at shell startup.

**Config linking (`config/`):** app configs (kitty, wezterm, ghostty, mako, fastfetch, starship.toml) are symlinked into `~/.config/` via `link_repo_config_path`, and only if the corresponding directory/file exists in the repo — new configs should follow this same guarded pattern rather than being unconditionally linked. KDE Plasma dotfiles (`dolphinrc`, `kcminputrc`, `kdeglobals`, `plasmarc`, etc.) are only linked when a KDE session is detected (`is_kde_plasma_session`) or `INSTALL_KDE_CONFIG=1` is forced.

**Alias catalog (`aliases`, 1170+ lines):** organized into banner-delimited sections (navigation/eza/fd/rg, editing/bat, kitty image helpers, git, tmux, docker/nginx/mariadb/plex service management, OpenRGB lighting effects, music sync, Ollama model shortcuts). When adding aliases, put them in the matching section rather than appending at the end.

**Environment-variable-driven behavior:** several install choices are controlled by env vars rather than prompts in non-interactive mode: `SHELL_MODE` (auto/bash/zsh), `PROMPT_BACKEND` (starship/p10k), `INSTALL_KDE_CONFIG` (auto/1/0), `INSTALL_MEDIA_TOOLS`/`INSTALL_OPENRGB`/`INSTALL_REAPER` (opt-in, default off). Preserve this pattern for new optional/interactive steps — auto-detect in a TTY, require an explicit env var otherwise.

## Destructive behavior — read before touching `setup.sh`/`uninstall.sh`

`clear_old_dotfiles()` in `setup.sh` unconditionally `rm -f`/`rm -rf`s real files/dirs at `~/.aliases`, `~/.gitconfig`, `~/.dircolors`, `~/.zshrc`, `~/.zsh`, `~/.tmux.conf`, `~/.p10k.zsh`, `~/.zprofile`, `~/.zlogin`, `~/.bashrc`, `~/.bash_profile`, `~/.bash_aliases`, `~/.bin` before recreating them as symlinks — this is by design (see README "Important behavior"), not a bug to "fix" by adding safety checks. `uninstall.sh` is the safe counterpart: `remove_if_symlink_to_repo` only removes a path if it's a symlink that resolves back into this repo, leaving real files alone. Keep new managed dotfiles consistent with this pair: add the target to `clear_old_dotfiles` + `create_dotfiles` in `setup.sh` and the matching `remove_if_symlink_to_repo` call in `uninstall.sh`.
