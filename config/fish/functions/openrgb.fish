function openrgb --description 'OpenRGB launcher (native binary or Flatpak)'
    if command -v openrgb >/dev/null 2>&1
        command openrgb $argv
    else if command -v flatpak >/dev/null 2>&1; and flatpak info org.openrgb.OpenRGB >/dev/null 2>&1
        flatpak run org.openrgb.OpenRGB $argv
    else
        echo "❌ OpenRGB is not installed (native or Flatpak)." >&2
        return 1
    end
end
