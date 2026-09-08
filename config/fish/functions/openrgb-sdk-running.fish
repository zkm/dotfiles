function openrgb-sdk-running --description 'Check whether OpenRGB SDK server is reachable'
    if command -v python3 >/dev/null 2>&1
        command python3 -c "from openrgb import OpenRGBClient; OpenRGBClient('$OPENRGB_SDK_HOST', int('$OPENRGB_SDK_PORT'), name='AliasProbe', protocol_version=2)" >/dev/null 2>&1
        return $status
    else if command -v python >/dev/null 2>&1
        command python -c "from openrgb import OpenRGBClient; OpenRGBClient('$OPENRGB_SDK_HOST', int('$OPENRGB_SDK_PORT'), name='AliasProbe', protocol_version=2)" >/dev/null 2>&1
        return $status
    end

    return 1
end
