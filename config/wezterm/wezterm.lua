local wezterm = require("wezterm")
local config = wezterm.config_builder()

config.font_dirs = {
  wezterm.home_dir .. "/.local/share/fonts/IBMPlexMono",
}

-- Font and Text Rendering
config.font = wezterm.font_with_fallback({
  "BlexMono Nerd Font Mono",
  "BlexMono Nerd Font",
  "BlexMono Nerd Font Propo",
  "FiraCode Nerd Font",
  "MesloLGS NF",
  "Noto Color Emoji",
})
config.font_size = 12
config.line_height = 1.2
config.cell_width = 0.9

-- Color Scheme
config.color_scheme = "tokyonight_night"

-- Window Appearance
config.window_padding = {
  left = 12,
  right = 12,
  top = 12,
  bottom = 12,
}
config.window_decorations = "RESIZE"
config.window_background_opacity = 0.95

-- Tab Bar
config.enable_tab_bar = true
config.tab_bar_at_bottom = false
config.hide_tab_bar_if_only_one_tab = true
config.use_fancy_tab_bar = false

-- Scrollback
config.scrollback_lines = 3500

-- Tab max width
config.tab_max_width = 32

-- Cursor
config.default_cursor_style = "SteadyBlock"
config.cursor_thickness = 2

-- Bell
config.audible_bell = "Disabled"
config.visual_bell = {
  fade_in_function = "EaseIn",
  fade_in_duration_ms = 75,
  fade_out_function = "EaseOut",
  fade_out_duration_ms = 75,
}

-- Initial Window Size
config.initial_cols = 120
config.initial_rows = 30

-- Keybindings
local act = wezterm.action
config.leader = {
  key = "b",
  mods = "CTRL",
  timeout_milliseconds = 1000,
}

config.keys = {
  {
    key = "Enter",
    mods = "ALT",
    action = act.ToggleFullScreen,
  },
  {
    key = "b",
    mods = "LEADER|CTRL",
    action = act.SendKey({ key = "b", mods = "CTRL" }),
  },
  {
    key = "t",
    mods = "CTRL|SHIFT",
    action = act.SpawnTab("CurrentPaneDomain"),
  },
  {
    key = "%",
    mods = "CTRL|SHIFT",
    action = act.SplitHorizontal({ domain = "CurrentPaneDomain" }),
  },
  {
    key = '"',
    mods = "CTRL|SHIFT",
    action = act.SplitVertical({ domain = "CurrentPaneDomain" }),
  },
  {
    key = "x",
    mods = "CTRL|SHIFT",
    action = act.CloseCurrentPane({ confirm = true }),
  },
  {
    key = "z",
    mods = "CTRL|SHIFT",
    action = act.TogglePaneZoomState,
  },
  {
    key = "RightArrow",
    mods = "CTRL|SHIFT",
    action = act.ActivatePaneDirection("Right"),
  },
  {
    key = "LeftArrow",
    mods = "CTRL|SHIFT",
    action = act.ActivatePaneDirection("Left"),
  },
  {
    key = "UpArrow",
    mods = "CTRL|SHIFT",
    action = act.ActivatePaneDirection("Up"),
  },
  {
    key = "DownArrow",
    mods = "CTRL|SHIFT",
    action = act.ActivatePaneDirection("Down"),
  },
  {
    key = "1",
    mods = "CTRL|SHIFT",
    action = act.ActivateTab(0),
  },
  {
    key = "2",
    mods = "CTRL|SHIFT",
    action = act.ActivateTab(1),
  },
  {
    key = "3",
    mods = "CTRL|SHIFT",
    action = act.ActivateTab(2),
  },
  {
    key = "4",
    mods = "CTRL|SHIFT",
    action = act.ActivateTab(3),
  },
  {
    key = "5",
    mods = "CTRL|SHIFT",
    action = act.ActivateTab(4),
  },
  {
    key = "6",
    mods = "CTRL|SHIFT",
    action = act.ActivateTab(5),
  },
  {
    key = "7",
    mods = "CTRL|SHIFT",
    action = act.ActivateTab(6),
  },
  {
    key = "8",
    mods = "CTRL|SHIFT",
    action = act.ActivateTab(7),
  },
  {
    key = "9",
    mods = "CTRL|SHIFT",
    action = act.ActivateTab(8),
  },

  {
    key = "LeftArrow",
    mods = "CTRL|SHIFT|ALT",
    action = act.AdjustPaneSize({ "Left", 3 }),
  },
  {
    key = "RightArrow",
    mods = "CTRL|SHIFT|ALT",
    action = act.AdjustPaneSize({ "Right", 3 }),
  },
  {
    key = "UpArrow",
    mods = "CTRL|SHIFT|ALT",
    action = act.AdjustPaneSize({ "Up", 2 }),
  },
  {
    key = "DownArrow",
    mods = "CTRL|SHIFT|ALT",
    action = act.AdjustPaneSize({ "Down", 2 }),
  },
  {
    key = "w",
    mods = "CTRL|SHIFT",
    action = act.CloseCurrentTab({ confirm = true }),
  },
  {
    key = "n",
    mods = "CTRL|SHIFT",
    action = act.SpawnWindow,
  },
  {
    key = "c",
    mods = "CTRL|SHIFT",
    action = act.CopyTo("Clipboard"),
  },
  {
    key = "v",
    mods = "CTRL|SHIFT",
    action = act.PasteFrom("Clipboard"),
  },
  {
    key = "l",
    mods = "CTRL|SHIFT",
    action = act.ShowLauncher,
  },
}

-- Inactive pane opacity
config.inactive_pane_hsb = {
  hue = 1.0,
  saturation = 1.0,
  brightness = 0.9,
}

return config
