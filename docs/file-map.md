# File / symlink map

Concrete correspondence between repo paths, `$HOME` (or `~/.config`)
targets, and which `setup.sh`/`uninstall.sh` function manages each side.
`link_repo_config_path` entries are only linked if the source exists in the
repo; everything under `create_dotfiles` marked "if exists" is similarly
guarded. This table's create/remove pairs are fully matched as of
2026-07-15 — see [[gotchas#setup-uninstall-drift]] for the prior gap and
fix, and keep both sides updated together going forward.

## Core dotfiles — `create_dotfiles()` / `clear_old_dotfiles()` / `remove_if_symlink_to_repo`

| Repo path | `$HOME` target | Created by | Removed by |
|---|---|---|---|
| `aliases` | `~/.aliases` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `bash_aliases` (if exists) | `~/.bash_aliases` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `aliases.local` (if exists, gitignored) | `~/.aliases.local` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `gitconfig` | `~/.gitconfig` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `dircolors` | `~/.dircolors` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `zsh/` | `~/.zsh` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `local/bin/` (if exists) | `~/.bin` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `local/share/applications/*.desktop` (if dir exists) | `~/.local/share/applications/*.desktop` | `create_dotfiles` | `remove_if_symlink_to_repo` (looped) |
| `zshrc` | `~/.zshrc` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `bashrc` (if exists) | `~/.bashrc` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `bash_profile` (if exists) | `~/.bash_profile` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `tmux.conf` | `~/.tmux.conf` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `p10k.zsh` (if exists) | `~/.p10k.zsh` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `zprofile` (if exists) | `~/.zprofile` | `create_dotfiles` | `remove_if_symlink_to_repo` |
| `zlogin` (if exists) | `~/.zlogin` | `create_dotfiles` | `remove_if_symlink_to_repo` |

`clear_old_dotfiles()` unconditionally removes real files at all of the
above `$HOME` targets (plus `~/.bash_aliases` and `~/.aliases.local`)
before `create_dotfiles` runs — see [[decisions#clear-old-dotfiles]].

`aliases.local` is the one entry here that's gitignored — it holds
private, machine-specific aliases (real hostnames/paths) that shouldn't be
in the public repo. `aliases` sources `~/.aliases.local` if present.
Because `clear_old_dotfiles()` removes `~/.aliases.local` unconditionally
on every `setup.sh` run regardless of whether `$repo_root/aliases.local`
exists, anyone (including someone using this repo as a template) who
creates a real `~/.aliases.local` without also placing a copy at
`$repo_root/aliases.local` will have it silently deleted, not
symlinked-and-preserved, the next time they run `setup.sh`. Keep the two in
sync (add to `$repo_root/aliases.local` first, then re-run `setup.sh`).

## App configs — `link_repo_config_path()` (only if `config/<name>` exists)

| Repo path | `~/.config` target | Removed by `uninstall.sh`? |
|---|---|---|
| `config/mako` | `~/.config/mako` | Yes |
| `config/kitty` | `~/.config/kitty` | Yes |
| `config/fastfetch` | `~/.config/fastfetch` | Yes |
| `config/starship.toml` | `~/.config/starship.toml` | Yes |
| `config/wezterm` | `~/.config/wezterm` | Yes |
| `config/ghostty` | `~/.config/ghostty` | Yes |
| `config/alacritty` | `~/.config/alacritty` | Yes |
| `config/mise` | `~/.config/mise` | Yes |

Note: `config/alacritty/windows-wsl.toml` inside `config/alacritty/` is
never itself deployed by this mechanism — the whole `config/alacritty`
directory (including that file) is symlinked to `~/.config/alacritty` for
Linux/macOS/WSL use, but `windows-wsl.toml`'s actual consumer is the
Windows-native Alacritty install, which reads `%APPDATA%\alacritty\
alacritty.toml` — a manual copy-paste, not a symlink, per that file's own
header comment.

## KDE Plasma configs — gated by `should_install_kde_config()`

| Repo path | `~/.config` target | Removed by `uninstall.sh`? |
|---|---|---|
| `config/dolphinrc` | `~/.config/dolphinrc` | Yes |
| `config/kcminputrc` | `~/.config/kcminputrc` | Yes |
| `config/kdeglobals` | `~/.config/kdeglobals` | Yes |
| `config/plasma-org.kde.plasma.desktop-appletsrc` | `~/.config/plasma-org.kde.plasma.desktop-appletsrc` | Yes |
| `config/plasmanotifyrc` | `~/.config/plasmanotifyrc` | Yes |
| `config/plasmarc` | `~/.config/plasmarc` | Yes |

## Other synced assets (copied, not symlinked)

| Repo path | Target | Managed by |
|---|---|---|
| `Icons/dark-side/` | `~/.local/share/icons/dark-side/` | `sync_custom_desktop_assets` (`cp -a`, one-way sync, not a symlink — re-run `setup.sh` to pick up icon changes) |
| `Wallpapers/` | `~/Pictures/Wallpapers/` | `sync_custom_desktop_assets` (same, `cp -a`) |
| `fonts/Fira_Code`, `fonts/MesloLGS NF`, `fonts/IBMPlexMono`, `fonts/JetBrainsMono` | `~/.local/share/fonts/*` (Linux) or `~/Library/Fonts` (macOS) | `install_fonts` (`cp`, then `fc-cache -f` on Linux); only `Fira_Code` and `MesloLGS NF` are cleaned up by `uninstall.sh`'s `cleanup_optional_components` — `IBMPlexMono`/`JetBrainsMono` font files are **not removed** on uninstall |

## Directories created (not symlinked) — `create_alias_directories()`

`~/Documents/work`, `~/Developer`, `${XDG_CONFIG_HOME:-~/.config}/OpenRGB`,
`${XDG_STATE_HOME:-~/.local/state}/openrgb` — plain `mkdir -p`, nothing to
uninstall.

## Non-managed reference config in the repo

`config/btop`, `config/gtk-3.0`, `config/gtk-4.0`, `config/neofetch`,
`config/OpenRGB`, `config/REAPER`, `config/waybar` exist under `config/` but
have **no** `link_repo_config_path` call in `create_dotfiles` as of this
writing — they're present in the repo (presumably as reference/backup or
manually-applied config) but not part of the automated install. Don't
assume every `config/*` subdirectory is live-linked; check `create_dotfiles`
before saying a config change here will "just take effect."
