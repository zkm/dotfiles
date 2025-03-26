# dotfiles

My personal dotfiles for Linux (primarily Arch) and macOS, including configuration for Neovim, Zsh, KDE Plasma, Git, and more.

## ⚙️ Usage

These dotfiles are organized for easy setup across fresh systems. To install:

```sh
git clone https://github.com/zkm/dotfiles ~/.dotfiles
cd ~/.dotfiles
./setup.sh
```

The setup script will back up any existing dotfiles and create symlinks or copy over key configurations.

## 🖥️ What’s Included

- **Shell**: Zsh (`.zshrc`, Powerlevel10k theme, aliases, custom functions)
- **Editor**: Neovim with Lua config and plugin management
- **Terminal**: Fastfetch, Btop, custom GTK and KDE themes
- **Git**: `.gitconfig` with aliases and sensible defaults
- **Desktop**: KDE Plasma config files, GTK themes, mimeapps
- **Media/Tools**:
  - REAPER (DAW config)
  - OpenRGB (peripheral lighting)
  - MPV (media player)
- **Fonts**: Fira Code and MesloLGS Nerd Font
- **Dotfiles Syncing**: Fonts, theming, and config stored in a portable structure

## 🧪 Tested On

- Arch Linux + KDE Plasma
- macOS (Zsh-only setup)

## 📝 Notes

For terminal theming (e.g., Solarized), make sure your terminal profile is named `Default`, or adjust the setup script accordingly.
