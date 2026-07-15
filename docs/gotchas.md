# Gotchas / known issues

Hard-won debugging knowledge that isn't obvious from reading the code. Add to
this file whenever a bug takes more than a few minutes to root-cause, so the
next session doesn't have to re-derive it.

## Alacritty on Windows/WSL — cursor lands one line below the prompt (fixed 2026-07-15)

**Symptom:** in `config/alacritty/windows-wsl.toml`, the two-line starship
prompt (`╭─ ...` / `╰─ ❯`) rendered fine, but the cursor (and typed input)
appeared on a *third*, blank line below `❯` instead of right after it. Did
not reproduce on native Linux/macOS Alacritty with the identical
`config/starship.toml`.

**Root cause:** `windows-wsl.toml` had `font.normal/bold/italic` set to
`"JetBrains Mono"` — a fine monospace font, but *not* Nerd-Font-patched.
Unlike wezterm, Alacritty has no per-config font-fallback list, so when the
prompt printed Nerd Font glyphs (the `❯`/`╭─`/`╰─` box-drawing/powerline
characters, os/git icons), there was no fallback font to pull them from and
their rendered width didn't match what the shell/starship assumed, which
knocked the cursor's row position off after the two-line prompt.

**Fix:** switched the font family to `"MesloLGS NF"` (already vendored at
`fonts/MesloLGS NF/*.ttf`), which is Nerd-Font-patched, in commit
`499c7441`. If you touch `windows-wsl.toml`'s font block again, remember:
the font *must* be a Nerd Font on Windows Alacritty specifically — there's
no fallback list to lean on like there is in `config/wezterm`.

**False leads investigated first (for the record, so they aren't retried):**
- Windows DPI-scaling override on `alacritty.exe` (Compatibility settings) —
  no effect.
- Shrinking `dimensions.columns` in `windows-wsl.toml` by 1 to dodge a
  hypothesized off-by-one column count from ConPTY — no effect.
- Blanking `right_format` in `config/starship.toml` to rule out a
  cursor-save/restore (DECSC/DECRC) escape-sequence bug specific to
  ConPTY — this *did* mask the symptom, which is why it was suspected, but
  it was a coincidental workaround, not the cause. The user briefly kept
  `right_format = ""` as a local-only preference on their Windows machine
  but did **not** commit it — the repo's `config/starship.toml` still has
  the full `right_format` with `$jobs$python$nodejs...$time$battery...`.
  Don't reintroduce a blanked `right_format` in the repo believing it's the
  fix for this bug; it isn't, and it would remove those modules for
  Linux/macOS users too.

See also: [[decisions#fonts-per-terminal]].

## `zsh/configs/prompt.zsh` and `zsh/configs/whole_line_completion.zsh` are dead code

`CLAUDE.md`'s architecture section says `zshrc sources ... zsh/configs/*.zsh
(prompt, completion)`, but as of this writing **`zshrc` does not source
either file**, and nothing else in the repo does either (confirmed via
`grep -rn "whole_line_completion\|configs/prompt"`). `~/.zsh` is symlinked
to the repo's `zsh/` directory by `create_dotfiles`, but nothing adds it to
`fpath` or sources its `configs/*.zsh` contents.

`prompt.zsh` defines a `git_prompt_info`-based `PS1` — an older, pre-starship
prompt that's now entirely superseded by `zshrc`'s starship/p10k selector
logic. It's very likely safe to delete, but hasn't been removed in case it's
kept intentionally as a reference/fallback. Confirm with the user before
deleting `zsh/configs/prompt.zsh` or `whole_line_completion.zsh`, and correct
the `CLAUDE.md` claim either way once resolved.

## `setup.sh` / `uninstall.sh` symlink lists had drifted out of sync (fixed 2026-07-15)

`CLAUDE.md` documents `uninstall.sh` as `remove_if_symlink_to_repo`-based and
says to "keep new managed dotfiles consistent with this pair," but the two
scripts' lists had stopped matching 1:1. Fixed gaps (now closed in
`uninstall.sh`'s `main()`):

- `create_dotfiles` links `config/mako`, `config/wezterm`, `config/ghostty`,
  `config/alacritty`, and `config/fastfetch` (via `link_repo_config_path`),
  but `uninstall.sh`'s `main()` never called `remove_if_symlink_to_repo` for
  any of `~/.config/{mako,wezterm,ghostty,alacritty,fastfetch}`. Added.
- `create_dotfiles`'s KDE config loop links `plasmanotifyrc` in addition to
  `dolphinrc`, `kcminputrc`, `kdeglobals`,
  `plasma-org.kde.plasma.desktop-appletsrc`, `plasmarc` — but
  `uninstall.sh`'s KDE loop was missing `plasmanotifyrc`. Added.

See [[file-map]] for the current correspondence table (now fully matched).
When adding a new `link_repo_config_path` call to `setup.sh`, add the
matching `remove_if_symlink_to_repo` call to `uninstall.sh` in the same
change — this pair drifted once already from exactly this kind of
one-sided edit.
