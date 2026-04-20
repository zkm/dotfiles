# dotfiles

Personal dotfiles for Linux, mainly Arch, and macOS.

Includes config for Bash, Zsh, Git, tmux, kitty, KDE/GTK theming, OpenRGB, REAPER, and related tools.

Neovim configuration now lives in a separate repository: [zkm/nvim-config](https://github.com/zkm/nvim-config).

Hyprland installs also include a basic Hyprlock setup, with `SUPER+L` bound to lock the screen.
Prompt setup defaults to Starship for both bash and zsh.

## ⚙️ Install

```sh
git clone https://github.com/zkm/dotfiles ~/.dotfiles
cd ~/.dotfiles
./setup.sh
```

## ⚠️ Important behavior

`setup.sh` is intentionally destructive for managed dotfiles.

Before it creates fresh symlinks, it removes existing files and directories such as:

- `~/.aliases`
- `~/.gitconfig`
- `~/.dircolors`
- `~/.zshrc`
- `~/.zsh`
- `~/.tmux.conf`
- `~/.p10k.zsh`
- `~/.zprofile`
- `~/.bashrc`
- `~/.bash_profile`
- `~/.bash_aliases`
- `~/.bin`

Back up anything important first.

## 🧩 Setup

`setup.sh` does the following:

1. Detects your shell mode.
   - Interactive terminals: prompts for `bash` or `zsh`, defaulting to your current shell.
   - Default (`SHELL_MODE=auto`) in non-interactive mode: keeps zsh users on zsh and falls back to bash otherwise.
   - Force zsh: `SHELL_MODE=zsh ./setup.sh`
   - Force bash: `SHELL_MODE=bash ./setup.sh`
2. Installs core packages:
   - macOS: Homebrew + packages
   - Linux: `pacman`, `dnf`, `apt`, or `yum`
   - Installs `starship` when available and uses it as the default prompt backend.
   - Linux: tries to install `papirus-icon-theme` (best effort; skipped if unavailable)
3. Creates directories used by shortcuts (`~/Documents/work`, `~/Developer`, OpenRGB dirs).
4. Symlinks repo-managed dotfiles into `$HOME`.
   - Includes bash files (`~/.bashrc`, `~/.bash_profile`, `~/.bash_aliases`) and zsh files.
   - Includes app config such as `~/.config/kitty` and `~/.config/starship.toml` when present in-repo.
   - Links `~/.config/hypr` only when Hyprland setup is enabled.
   - Links KDE Plasma config files only when setup is run in a KDE session, or when overridden with `INSTALL_KDE_CONFIG=1`.
5. Syncs custom desktop assets when present:
   - `Icons/dark-side` -> `~/.local/share/icons/dark-side`
   - `Wallpapers` -> `~/Pictures/Wallpapers`
6. Uses repo-managed shell configs to initialize `pyenv`, `rbenv`, and `nvm` when installed.
7. Configures Starship prompt for bash and keeps the existing zsh prompt flow.
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
15. Optionally installs Hyprland stack with a prompt in interactive terminals.

## Useful shortcuts

The full shell catalog lives in `aliases`, but these are the shortcuts I use most.

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
| `ai`, `chat`, `code-ai`, `fast-ai`, `chill-ai` | Start common Ollama sessions |
| `llama3`, `codellama`, `mistral`, `gemma` | Launch specific Ollama models |
| `ollama-list`, `ollama-remove`, `ollama-clean`, `ollama-clean-safe` | Manage Ollama models |

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

## 🧱 Optional: Hyprland install/setup

Hyprland setup is opt-in by default.

- Interactive terminal: setup asks `Would you like to install/setup Hyprland? [y/N]`.
- Non-interactive terminal: setup skips Hyprland to avoid hangs and prints a tip.

Use environment overrides:

```sh
# Force install and link Hyprland config
INSTALL_HYPRLAND=1 ./setup.sh

# Force skip and do not link Hyprland config
INSTALL_HYPRLAND=0 ./setup.sh
```

## 🖥️ Platform notes

### Linux

- KDE/GTK configs are primarily Linux-targeted.
- `setup.sh` only links Plasma config files when KDE is detected from the current session environment.
- Override detection with `INSTALL_KDE_CONFIG=1 ./setup.sh` or force-skip with `INSTALL_KDE_CONFIG=0 ./setup.sh`.
- Package install paths are tuned mostly for Arch first, with `dnf`/`apt`/`yum` fallbacks.
- On Debian Bookworm (including Raspberry Pi OS Bookworm), `fastfetch` may be unavailable in default APT repositories. Setup now treats it as optional and continues.
- Shell setup is bash/zsh-focused, and the alias catalog is bash/zsh-oriented.
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

This removes symlinks that point to this repo, cleans up shell init lines added by setup, and removes optional components installed by setup, including the Powerlevel10k clone, the `nvm` directory, and installed font copies.

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

- Arch Linux + KDE Plasma
- Fedora Linux Asahi Remix 43 (Workstation Edition, GNOME 49.5, Mutter/Wayland, aarch64)
- Gentoo + KDE Plasma
- Ubuntu + GNOME
- Linux Mint + Cinnamon
- Debian + GNOME
- Rocky Linux + GNOME
- CachyOS + GNOME 50
- macOS (Homebrew-based path)

## 🧹 Ignored runtime files

The repo ignores generated and runtime artifacts, including:

- OpenRGB logs/cache/venv and backup JSON files
- REAPER license/registration artifacts
- Runtime logs and editor temp files

This keeps the repo focused on reusable configuration instead of machine-specific runtime files.
