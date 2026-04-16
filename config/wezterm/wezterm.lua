local wezterm = require("wezterm")
local config = wezterm.config_builder()

config.font = wezterm.font_with_fallback({
  "JetBrainsMono Nerd Font Mono",
  "BlexMono Nerd Font Mono",
  "Noto Color Emoji",
})
config.font_size = 11
config.line_height = 1.15

config.color_scheme = "Tokyo Night"

config.colors = {
  cursor_bg = "#bb9af7",
  cursor_fg = "#1a1b26",
  selection_bg = "#394b70",
  selection_fg = "#c0caf5",
  foreground = "#c0caf5",
  background = "#1a1b26",
  tab_bar = {
    background = "#15161e",
    active_tab = {
      bg_color = "#1a1b26",
      fg_color = "#c0caf5",
    },
    inactive_tab = {
      bg_color = "#15161e",
      fg_color = "#565f89",
    },
    inactive_tab_hover = {
      bg_color = "#1a1b26",
      fg_color = "#7aa2f7",
    },
  },
  ansi = {
    "#15161e",
    "#f7768e",
    "#9ece6a",
    "#e0af68",
    "#7aa2f7",
    "#bb9af7",
    "#7dcfff",
    "#a9b1d6",
  },
  brights = {
    "#414868",
    "#f7768e",
    "#9ece6a",
    "#e0af68",
    "#7aa2f7",
    "#bb9af7",
    "#7dcfff",
    "#c0caf5",
  },
}

config.window_padding = { left = 10, right = 10, top = 10, bottom = 10 }
config.window_decorations = "RESIZE"
config.window_background_opacity = 0.97

config.enable_tab_bar = true
config.tab_bar_at_bottom = false
config.hide_tab_bar_if_only_one_tab = true
config.tab_max_width = 24

config.scrollback_lines = 5000
config.default_cursor_style = "SteadyBlock"
config.cursor_blink_rate = 800
config.audible_bell = "Disabled"

config.initial_cols = 130
config.initial_rows = 32

local act = wezterm.action
config.leader = { key = "b", mods = "CTRL", timeout_milliseconds = 1000 }

config.keys = {
  { key = "Enter", mods = "ALT", action = act.ToggleFullScreen },
  { key = "t", mods = "CTRL|SHIFT", action = act.SpawnTab("CurrentPaneDomain") },
  { key = "w", mods = "CTRL|SHIFT", action = act.CloseCurrentTab({ confirm = true }) },
  { key = "%", mods = "CTRL|SHIFT", action = act.SplitHorizontal({ domain = "CurrentPaneDomain" }) },
  { key = '"', mods = "CTRL|SHIFT", action = act.SplitVertical({ domain = "CurrentPaneDomain" }) },
  { key = "x", mods = "CTRL|SHIFT", action = act.CloseCurrentPane({ confirm = true }) },
  { key = "z", mods = "CTRL|SHIFT", action = act.TogglePaneZoomState },
  { key = "RightArrow", mods = "CTRL|SHIFT", action = act.ActivatePaneDirection("Right") },
  { key = "LeftArrow", mods = "CTRL|SHIFT", action = act.ActivatePaneDirection("Left") },
  { key = "UpArrow", mods = "CTRL|SHIFT", action = act.ActivatePaneDirection("Up") },
  { key = "DownArrow", mods = "CTRL|SHIFT", action = act.ActivatePaneDirection("Down") },
  { key = "1", mods = "CTRL|SHIFT", action = act.ActivateTab(0) },
  { key = "2", mods = "CTRL|SHIFT", action = act.ActivateTab(1) },
  { key = "3", mods = "CTRL|SHIFT", action = act.ActivateTab(2) },
  { key = "4", mods = "CTRL|SHIFT", action = act.ActivateTab(3) },
  { key = "5", mods = "CTRL|SHIFT", action = act.ActivateTab(4) },
  { key = "6", mods = "CTRL|SHIFT", action = act.ActivateTab(5) },
  { key = "7", mods = "CTRL|SHIFT", action = act.ActivateTab(6) },
  { key = "8", mods = "CTRL|SHIFT", action = act.ActivateTab(7) },
  { key = "9", mods = "CTRL|SHIFT", action = act.ActivateTab(8) },
  { key = "n", mods = "CTRL|SHIFT", action = act.SpawnWindow },
  { key = "l", mods = "CTRL|SHIFT", action = act.ShowLauncher },
  { key = "[", mods = "CTRL|SHIFT", action = act.ActivateCopyMode },
  { key = "Tab", mods = "CTRL", action = act.ActivateTabRelative(1) },
  { key = "Tab", mods = "CTRL|SHIFT", action = act.ActivateTabRelative(-1) },
}

return config
