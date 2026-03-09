# off_openrgb.py
from openrgb import OpenRGBClient
from openrgb.utils import RGBColor
import os

HOST = os.getenv("OPENRGB_SDK_HOST", "127.0.0.1")
PORT = int(os.getenv("OPENRGB_SDK_PORT", "6742"))


def set_direct_mode_if_supported(dev):
    mode_names = [m.name for m in getattr(dev, "modes", [])]
    if "Direct" in mode_names:
        dev.set_mode("Direct")


def main():
    try:
        client = OpenRGBClient(HOST, PORT, name="OffScript", protocol_version=2)
    except OSError as exc:
        raise SystemExit(
            f"Could not connect to OpenRGB SDK server at {HOST}:{PORT}.\n"
            "Start it first, for example:\n"
            "  openrgb --noautoconnect --server --loglevel warning\n"
            f"Original error: {exc}"
        )

    zone_count = 0
    for dev in client.devices:
        set_direct_mode_if_supported(dev)
        for zone in getattr(dev, "zones", []):
            led_count = len(getattr(zone, "leds", []))
            if led_count <= 0:
                continue
            zone.set_colors([RGBColor(0, 0, 0)] * led_count)
            zone_count += 1

    print(f"Turned off {zone_count} zone(s).")


if __name__ == "__main__":
    main()
