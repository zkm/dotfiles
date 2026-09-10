-- Monitor wiki https://wiki.hypr.land/Configuring/Basics/Monitors/
-- Example: output can be found with hyprctl monitors. Edit variables.lua for the monitor outputs instead of here directly
-- hl.monitor({
--     output    = "MONITOR1",
--     mode      = "1920x1080@60",
--     position  = "0x0",
--     scale     = "1",
-- })

-- Internal laptop panel: off while docked (laptop lives closed in the
-- dock), but only if the dock's external monitor is actually connected --
-- otherwise disabling it would leave zero active outputs and crash
-- Hyprland (e.g. when the external monitor gets unplugged before the lid
-- is opened). The lid-switch binds in binds.lua flip this live afterwards
-- if the lid itself opens/closes.
local dockConnected = false
local ok, monitors = pcall(hl.get_monitors)
if ok and monitors then
    for _, m in ipairs(monitors) do
        if m.name == MONITOR1 then
            dockConnected = true
            break
        end
    end
end

hl.monitor({
    output    = "eDP-1",
    disabled  = dockConnected,
    mode      = "1920x1080@60",
    scale     = "1",
})

-- Pinned to 2560x1440@59.95 instead of "preferred" (4K): this dock's DP
-- link only has bandwidth for 4K@30Hz, so 1440p60 is smoother in practice.
hl.monitor({
    output    = MONITOR1,
    mode      = "2560x1440@59.95",
    position  = "auto",
    scale     = "auto",
})

-- Wildcard fallback: catches any monitor not covered by a rule above
-- (including MONITOR1 itself if it's ever renamed/replaced) so Hyprland
-- always has at least one active output instead of crashing with none.
hl.monitor({
    output    = "",
    mode      = "preferred",
    position  = "auto",
    scale     = "auto",
})
