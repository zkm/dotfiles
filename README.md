# dotfiles

[![CI](https://github.com/zkm/dotfiles/actions/workflows/ci.yml/badge.svg)](https://github.com/zkm/dotfiles/actions/workflows/ci.yml)

![Arch Linux](https://img.shields.io/badge/Arch%20Linux-1793D1?logo=archlinux&logoColor=white)
![macOS](https://img.shields.io/badge/macOS-000000?logo=apple&logoColor=white)
![Zsh](https://img.shields.io/badge/Zsh-F15A24?logo=zsh&logoColor=white)
![Bash](https://img.shields.io/badge/Bash-4EAA25?logo=gnubash&logoColor=white)
![Fish](https://img.shields.io/badge/Fish-34C534?logo=fishshell&logoColor=white)
![Starship](https://img.shields.io/badge/Starship-DD0B78?logo=starship&logoColor=white)
![tmux](https://img.shields.io/badge/tmux-1BB91F?logo=tmux&logoColor=white)
![KDE Plasma](https://img.shields.io/badge/KDE%20Plasma-1D99F3?logo=kdeplasma&logoColor=white)
![Hyprland](https://img.shields.io/badge/Hyprland-58E1FF?logo=hyprland&logoColor=black)

Personal dotfiles for Linux, mainly Arch, and macOS.

Includes config for Bash, Zsh, Fish, Git, tmux, kitty, mise, KDE/GTK theming, OpenRGB, REAPER, and related tools, plus a reference snapshot of a Hyprland setup.

Neovim configuration now lives in a separate repository: [zkm/nvim-config](https://github.com/zkm/nvim-config).
Starship is the prompt for bash, zsh and fish.

## ⚙️ Install

```sh
git clone https://github.com/zkm/dotfiles ~/.dotfiles
cd ~/.dotfiles
./setup.sh
```

## ⚠️ Important behavior

`setup.sh` is intentionally destructive for managed dotfiles.

Before it creates fresh symlinks, it removes these files and directories in your home directory:

- Shell: `~/.bashrc`, `~/.bash_profile`, `~/.bash_aliases`, `~/.zshrc`, `~/.zprofile`, `~/.zlogin`, `~/.zsh`, `~/.p10k.zsh`
- Aliases: `~/.aliases` and `~/.aliases.local`
- Other: `~/.gitconfig`, `~/.gemrc`, `~/.tmux.conf`, `~/.dircolors`, `~/.bin`

It also replaces each of these in `~/.config` with a link to the repo's copy, deleting whatever was there:

- `fish`, `mise`, `starship.toml`, `kitty`, `wezterm`, `ghostty`, `alacritty`, `mako`, `fastfetch`

Back up anything important first. To keep machine-only aliases, put them in `~/.dotfiles/aliases.local` (bash/zsh) or `~/.dotfiles/config/fish/aliases.local.fish` (fish). Both are gitignored, and setup links the first one to `~/.aliases.local`.

## 🧩 Setup

`setup.sh` does the following:

1. Detects your shell mode.
   - Interactive terminals: asks for `bash`, `zsh` or `fish`, defaulting to your current shell.
   - Non-interactive (`SHELL_MODE=auto`, the default): keeps your current shell if it's zsh or fish, otherwise uses bash.
   - Force a shell: `SHELL_MODE=bash ./setup.sh`, `SHELL_MODE=zsh ./setup.sh` or `SHELL_MODE=fish ./setup.sh`
   - The chosen shell is installed if needed and set as your login shell with `chsh`.
2. Installs core packages:
   - macOS: Homebrew + packages
   - Linux: `pacman`, `dnf`, `apt`, `yum` or `emerge` (Gentoo)
   - Installs `starship` when available and uses it as the default prompt backend.
   - Linux: tries to install `papirus-icon-theme` (best effort; skipped if unavailable)
3. Creates directories used by shortcuts (`~/Documents/work`, `~/Developer`, OpenRGB dirs).
4. Symlinks repo-managed dotfiles into `$HOME`.
   - Includes bash files (`~/.bashrc`, `~/.bash_profile`, `~/.bash_aliases`) and zsh files.
   - Includes `~/.config/fish` (see [Fish](#-fish) below).
   - Includes app config such as `~/.config/kitty`, `~/.config/mise` and `~/.config/starship.toml` when present in-repo.
5. Syncs custom desktop assets when present:
   - `Icons/dark-side` -> `~/.local/share/icons/dark-side`
   - `Wallpapers` -> `~/Pictures/Wallpapers`
6. Uses repo-managed shell configs to initialize `pyenv`, `rbenv`, and `mise` when installed.
7. Uses Starship as the prompt. The init hooks are already in `bashrc`, `zshrc` and `config/fish/config.fish`.
8. Optionally installs Powerlevel10k only when `PROMPT_BACKEND=p10k` and zsh mode is active.
9. Installs fonts (MesloLGS Nerd Font + Fira Code Nerd Font, with local file fallback).
10. Sets the default Terminal.app profile on macOS to `Pro`.
11. Tries to install browsers (Firefox and Chrome/Chromium).
12. Tries to install Visual Studio Code.
   - Arch Linux: bootstraps `yay` if needed and installs `visual-studio-code-bin` from AUR.
13. Installs Docker:
   - macOS: installs Docker Desktop (Homebrew cask)
   - Linux: installs Docker engine + compose plugin/package, enables the service, and adds your user to the `docker` group
14. Optionally installs OpenRGB and REAPER.

## Useful shortcuts

The full catalog lives in `aliases` for bash and zsh, and in `config/fish/conf.d/10-aliases.fish` plus `config/fish/functions/` for fish. The shortcuts below work in all three shells.

### Navigation and files

| Shortcut | What it does |
| --- | --- |
| `work` / `dev` | Go to common working directories |
| `j <name>` | Jump to frequently used directories with zoxide |
| `l`, `ll`, `la`, `lt`, `tree` | List files quickly with `eza` when available |
| `ff <pattern>` | Find files with `fd` |
| `search <pattern>` | Search recursively with `rg` |
| `fcd` | Pick a directory with `fzf` and change into it |
| `fvim` | Pick one or more files with `fzf` and open them in `vim` |

### Editing and previewing

| Shortcut | What it does |
| --- | --- |
| `v` | Open `nvim` |
| `vim` / `vi` | Open `nvim` or fall back to `vim` |
| `catp <file>` | Show plain file output, using `bat` when installed |
| `preview <file>` | Preview a file with line numbers and syntax highlighting when available |
| `json` | Pretty-print JSON with `jq` |

### Kitty helpers

| Shortcut | What it does |
| --- | --- |
| `imgcat <file>` | Display images directly in Kitty |
| `imgpick` | Pick an image with `fzf` and preview it in Kitty |
| `img <file>` | Run `imgcat` with a shorter command |

### Git and tmux

| Shortcut | What it does |
| --- | --- |
| `g`, `gst`, `gd`, `gl` | Run common Git commands |
| `gco`, `gb`, `gc`, `gcm`, `gp`, `gps` | Check out, branch, commit, pull, and push |
| `tl`, `ta`, `tn`, `tk` | List, attach, create, and kill tmux sessions |

### System and services

| Shortcut | What it does |
| --- | --- |
| `reload` | Restart the current shell |
| `bt` | Launch `btop` |
| `neofetch` | Run `fastfetch` when available, or fall back to `neofetch` |
| `docker-start`, `docker-stop`, `docker-restart`, `docker-status`, `docker-log` | Manage the Docker daemon |
| `web-start`, `web-stop`, `web-restart`, `web-status` | Manage nginx, php-fpm, and mariadb together |
| `plex-start`, `plex-stop`, `plex-status` | Manage the Plex service |

### OpenRGB, media, and AI

| Shortcut | What it does |
| --- | --- |
| `rgb-blizzard`, `rgb-matrix`, `rgb-rainbow`, `rgb-off` | Start or stop OpenRGB lighting effects |
| `rgb-stop` | Stop running RGB scripts and turn the lights off |
| `sync-local-music`, `syncipod`, `dryrun-music`, `sync-music` | Run music library sync workflows |

## 🐟 Fish

`config/fish` is linked to `~/.config/fish` and is a full port of the bash/zsh setup:

- `config.fish`: PATH, mise, Starship, fzf key bindings (`Ctrl-R`, `Ctrl-T`, `Alt-C`) and the motd banner.
- `conf.d/10-aliases.fish` and `functions/`: the alias catalog, including zoxide's `j`. Longer helpers (Navidrome, RAID, OpenRGB, Docker) are fish functions.
- Plugins are managed by [fisher](https://github.com/jorgebucaran/fisher) and listed in `fish_plugins`: [autopair.fish](https://github.com/jorgebucaran/autopair.fish) and [done](https://github.com/franciscolourenco/done) (a desktop notification when a long command finishes). The plugin files are committed, so they work right after setup. Run `fisher update` to refresh them.
- Machine-specific aliases go in `~/.config/fish/aliases.local.fish`, which is gitignored.
- `fish_variables` (fish's own universal-variable state) is gitignored too.

Powerlevel10k is zsh-only, so `PROMPT_BACKEND=p10k` has no effect in fish.

## 🔐 Git credentials

`gitconfig` keeps credentials in memory for 8 hours (`credential.helper = cache`) instead of writing them to a plaintext `~/.git-credentials`. GitHub uses `gh auth git-credential`.

For a persistent store, add the helper for your OS to `~/.gitconfig.local`, which `gitconfig` includes and git doesn't track:

```ini
# Linux with a Secret Service (KWallet, gnome-keyring)
[credential]
	helper = /usr/lib/git-core/git-credential-libsecret
```

On macOS, Apple's and Homebrew's git already use the keychain (`osxkeychain`). The libsecret helper's path differs by distro, so check where your git package installs it.

## 🐳 Docker install notes

- macOS: Docker Desktop is installed if missing. Launch Docker Desktop once after setup to initialize the daemon.
- Linux: setup tries to enable and start Docker with `systemctl`, then adds your user to the `docker` group.
- Linux group changes usually require logging out and back in before running Docker without `sudo`.

## 🛠️ Docker troubleshooting

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

## 🎛️ Optional: OpenRGB and REAPER install

These installs are optional.

If you run `./setup.sh` interactively, setup will prompt:

- Install OpenRGB? [y/N]
- Install REAPER? [y/N]

If you run setup non-interactively, use environment flags.

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

- macOS: tries the Homebrew casks `openrgb` and `reaper`.
- Arch: installs `openrgb` via pacman; tries `reaper` via `yay` (AUR).
- apt/dnf/yum systems: try to install `openrgb`; REAPER is usually installed manually.

## 🖥️ Platform notes

### Linux

- GTK configs are primarily Linux-targeted. KDE Plasma dotfiles (`dolphinrc`, `kdeglobals`, etc.) are not managed by this repo — they change too often from live desktop state to be worth tracking in git.
- Package install paths are tuned mostly for Arch first, with `dnf`/`apt`/`yum` fallbacks.
- On Debian Bookworm (including Raspberry Pi OS Bookworm), `fastfetch` may be unavailable in default APT repositories. Setup now treats it as optional and continues.
- Shell startup shows a [motd-forge](https://rubygems.org/gems/motd_forge) banner instead of running `fastfetch`/`neofetch` automatically (those are still available manually via the `neofetch` alias). `setup.sh` installs the gem with `gem install motd_forge` if a `gem` command is on `PATH`; otherwise install Ruby (e.g. via `rbenv`) first and run that command yourself.
- bash, zsh and fish are all supported, with the same aliases in each.
- Hyprland: `config/hypr` (CachyOS's Lua-based config) and `config/waybar` are reference snapshots and setup doesn't install them. CachyOS manages that config through its own packages, so linking it from here would fight package upgrades. Edit `~/.config/hypr` directly and copy changes back into the repo. `update_waybar.sh` copies the Waybar config into `~/.config/waybar`.
- Tested environments are listed below.

### macOS

- Uses Homebrew for package/app installation.
- Installs fonts into `~/Library/Fonts`.
- Sets Apple Terminal default/startup profile to `Pro`.
- Linux desktop theming files are present in-repo but mostly not applied by macOS tooling.

## 🔁 Uninstall and cleanup

Run:

```sh
./uninstall.sh
```

This removes symlinks that point to this repo, cleans up shell init lines added by setup, and removes optional components installed by setup, including the Powerlevel10k clone and installed font copies.

## 💾 Backup current files

Create a timestamped snapshot of your current files:

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

## 🧪 Tested on

- Arch Linux + KDE Plasma 6.6.5
- Fedora Linux 44 + GNOME 50.1
- Gentoo + KDE Plasma
- Ubuntu + GNOME
- Linux Mint + Cinnamon
- Debian + GNOME
- Rocky Linux + GNOME
- CachyOS + GNOME 50
- CachyOS + Hyprland (fish as login shell)
- macOS (Homebrew-based path)

## 🧹 Ignored runtime files

The repo ignores generated and runtime artifacts, including:

- OpenRGB logs/cache/venv and backup JSON files
- fish's `fish_variables` and the local-only `aliases.local.fish`
- pipx launcher symlinks in `local/bin`
- REAPER license/registration artifacts
- Runtime logs and editor temp files

This keeps the repo focused on reusable configuration instead of machine-specific runtime files.
