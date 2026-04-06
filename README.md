# dotfiles

Personal dotfiles for Linux (primarily Arch) and macOS.

Includes configuration for Zsh, Git, tmux, kitty, KDE/GTK theming, OpenRGB, REAPER, and related tooling.

Neovim configuration now lives in a separate repository: [zkm/nvim-config](https://github.com/zkm/nvim-config).

Hyprland installs also include a basic Hyprlock setup, with `SUPER+L` bound to lock the screen.

## ⚙️ Install

```sh
git clone https://github.com/zkm/dotfiles ~/.dotfiles
cd ~/.dotfiles
./setup.sh
```

## ⚠️ Important Behavior

`setup.sh` is intentionally destructive for managed dotfiles.

Before creating fresh symlinks, it removes existing files/dirs such as:

- `~/.aliases`
- `~/.gitconfig`
- `~/.dircolors`
- `~/.zshrc`
- `~/.zsh`
- `~/.tmux.conf`
- `~/.p10k.zsh`
- `~/.zprofile`
- `~/.bin`

Back up anything important first.

## 🧩 What Setup Does

`setup.sh` currently performs the following:

1. Ensures zsh is your shell (if currently using bash).
2. Installs core packages:
   - macOS: Homebrew + packages
   - Linux: `pacman`, `dnf`, `apt`, or `yum`
3. Creates directories used by aliases (`~/Documents/work`, `~/Developer`, OpenRGB dirs).
4. Symlinks repo-managed dotfiles into `$HOME`.
   - Includes app config such as `~/.config/hypr` and `~/.config/kitty` when present in-repo.
5. Adds `pyenv`, `rbenv`, and `nvm` init lines to `~/.zshrc` (if missing).
6. Installs Powerlevel10k.
7. Installs fonts (MesloLGS Nerd Font + Fira Code Nerd Font, with local file fallback).
8. Applies Terminal.app default profile on macOS (`Pro`).
9. Attempts browser install (Firefox + Chrome/Chromium).
10. Attempts Visual Studio Code install.
   - Arch Linux: bootstraps `yay` if needed and installs `visual-studio-code-bin` from AUR.
11. Installs Docker:
   - macOS: installs Docker Desktop (Homebrew cask)
   - Linux: installs Docker engine + compose plugin/package, enables the service, and adds your user to the `docker` group
12. Optionally installs OpenRGB/REAPER (opt-in flags).

## 🐳 Docker Install Notes

- macOS: Docker Desktop is installed if missing. Launch Docker Desktop once after setup to initialize the daemon.
- Linux: setup attempts to enable/start Docker via `systemctl` and adds your user to the `docker` group.
- Linux group changes usually require logging out and back in before running Docker without `sudo`.

## 🛠️ Docker Troubleshooting

Quick checks:

```sh
docker --version
docker info
docker compose version
```

If `docker info` fails on macOS:

- Open Docker Desktop and wait until it shows as running.

If Linux says permission denied on `/var/run/docker.sock`:

```sh
sudo usermod -aG docker "$USER"
newgrp docker
docker info
```

If the daemon is not running on Linux:

```sh
sudo systemctl enable --now docker
sudo systemctl status docker
```

## 🎛️ Optional: OpenRGB + REAPER Install

These are now opt-in per user/machine.

If you run `./setup.sh` interactively (normal terminal), setup will prompt:

- Install OpenRGB? [y/N]
- Install REAPER? [y/N]

If you run setup non-interactively (automation/CI), use env flags.

Install both:

```sh
INSTALL_MEDIA_TOOLS=1 ./setup.sh
```

Install only one:

```sh
INSTALL_OPENRGB=1 ./setup.sh
INSTALL_REAPER=1 ./setup.sh
```

Notes:

- macOS: tries Homebrew casks (`openrgb`, `reaper`).
- Arch: installs `openrgb` via pacman; tries `reaper` via `yay` (AUR).
- apt/dnf/yum systems: attempts `openrgb`; REAPER is usually manual.

## 🖥️ Platform Notes

### Linux

- KDE/GTK configs are primarily Linux-targeted.
- Package install paths are tuned mostly for Arch first, with `dnf`/`apt`/`yum` fallbacks.
- On Debian Bookworm (including Raspberry Pi OS Bookworm), `fastfetch` may be unavailable in default APT repositories. Setup now treats it as optional and continues.
- Tested environments: Arch Linux + KDE Plasma, Fedora Linux Asahi Remix 43 (Workstation Edition, GNOME 49.5, Mutter/Wayland, aarch64).

### macOS

- Uses Homebrew for package/app installation.
- Installs fonts into `~/Library/Fonts`.
- Sets Apple Terminal default/startup profile to `Pro`.
- Linux desktop theming files are present in-repo but mostly not applied by macOS tooling.

## 🔁 Uninstall / Cleanup

Run:

```sh
./uninstall.sh
```

This removes symlinks that point to this repo, cleans setup-added shell init lines, and removes optional components installed by setup (Powerlevel10k clone, nvm directory, and installed font copies).

## 💾 Backup Current Files

Create a timestamped snapshot of all current files:

```sh
./local/bin/backup_current_files.sh [source_dir] [backup_dir]
```

Examples:

```sh
# Snapshot current directory into ./backups/<timestamp>
./local/bin/backup_current_files.sh

# Snapshot ~/.config into ~/Backups/config-snapshots/<timestamp>
./local/bin/backup_current_files.sh ~/.config ~/Backups/config-snapshots
```

Notes:

- Each run creates a new snapshot directory named like `20260322_101530`.
- Directory structure is preserved inside each snapshot.
- If the backup directory is inside the source directory, it is automatically excluded.

## 🧪 Tested On

- Arch Linux + KDE Plasma
- Fedora Linux Asahi Remix 43 (Workstation Edition, GNOME 49.5, Mutter/Wayland, aarch64)
- macOS (Homebrew-based path)

## 🧹 Ignored Runtime Files

The repo ignores generated/runtime artifacts, including:

- OpenRGB logs/cache/venv and backup JSON files
- REAPER license/registration artifacts
- Runtime logs and editor temp files

This keeps syncs focused on reusable configuration.
