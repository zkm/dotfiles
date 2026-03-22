# dotfiles

Personal dotfiles for Linux (primarily Arch) and macOS.

Includes configuration for Zsh, Neovim, Git, tmux, KDE/GTK theming, OpenRGB, REAPER, and related tooling.

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
- `~/.vimrc`
- `~/.vimrc.plugs`
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
3. Bootstraps Neovim compatibility (`~/.config/nvim/init.vim` sourcing `~/.vimrc`).
4. Creates directories used by aliases (`~/Documents/work`, `~/Developer`, OpenRGB dirs).
5. Symlinks repo-managed dotfiles into `$HOME`.
6. Adds `pyenv`, `rbenv`, and `nvm` init lines to `~/.zshrc` (if missing).
7. Installs Powerlevel10k, vim-plug plugins, and `copilot.vim`.
8. Installs fonts (MesloLGS Nerd Font + Fira Code Nerd Font, with local file fallback).
9. Applies Terminal.app default profile on macOS (`Pro`).
10. Attempts browser install (Firefox + Chrome/Chromium).
11. Attempts Visual Studio Code install.
12. Installs Docker:
   - macOS: installs Docker Desktop (Homebrew cask)
   - Linux: installs Docker engine + compose plugin/package, enables the service, and adds your user to the `docker` group
13. Optionally installs OpenRGB/REAPER (opt-in flags).

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

This removes symlinks that point to this repo, cleans setup-added shell init lines, and removes optional components installed by setup (Powerlevel10k clone, Neovim copilot plugin, nvm directory, and installed font copies).

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
