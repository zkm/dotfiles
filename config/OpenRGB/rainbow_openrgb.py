# rainbow_openrgb.py
from openrgb import OpenRGBClient
from openrgb.utils import RGBColor
import colorsys
import os
import time

# ---- config ----
HOST = os.getenv('OPENRGB_SDK_HOST', '127.0.0.1')
PORT = int(os.getenv('OPENRGB_SDK_PORT', '6742'))
ZONE_A_NAME = os.getenv('OPENRGB_ZONE_A', 'ARGB_V2_1/V2.3')  # 36 LEDs
ZONE_B_NAME = os.getenv('OPENRGB_ZONE_B', 'ARGB_V2_2')       # 24 LEDs
ANIMATE = False                 # set True for flowing rainbow
FPS = 24
FLOW_SECONDS_PER_LOOP = 8.0     # how fast the rainbow cycles when animated
# ----------------

def gradient_colors(count, phase=0.0):
    """Return 'count' evenly spaced HSV→RGB colors across the hue wheel.
       phase ∈ [0,1) shifts the whole gradient (used for animation)."""
    cols = []
    for i in range(count):
        h = (i / count + phase) % 1.0
        r, g, b = [int(x * 255) for x in colorsys.hsv_to_rgb(h, 1.0, 1.0)]
        cols.append(RGBColor(r, g, b))
    return cols

def set_zone_colors(zone, colors):
    if zone is not None and len(zone.leds) == len(colors):
        zone.set_colors(colors)
        return True
    return False


def find_zone(dev, zone_name):
    for zone in dev.zones:
        if zone.name == zone_name:
            return zone
    return None


def set_direct_mode_if_supported(dev):
    mode_names = [m.name for m in getattr(dev, 'modes', [])]
    if 'Direct' in mode_names:
        dev.set_mode('Direct')
        return True
    return False

def main():
    try:
        client = OpenRGBClient(HOST, PORT, name='RainbowScript', protocol_version=2)
    except OSError as exc:
        raise SystemExit(
            f"Could not connect to OpenRGB SDK server at {HOST}:{PORT}.\n"
            "Start it first, for example:\n"
            "  openrgb --noautoconnect --server --loglevel warning\n"
            f"Original error: {exc}"
        )
    devices = client.devices

    # Build target list with direct zone references to avoid repeated scans in the loop
    targets = []
    for dev in devices:
        zone_a = find_zone(dev, ZONE_A_NAME)
        zone_b = find_zone(dev, ZONE_B_NAME)
        if zone_a is not None or zone_b is not None:
            targets.append((dev, zone_a, zone_b))

    if not targets:
        raise SystemExit("Couldn’t find devices with your ARGB_V2 zones. "
                         "Make sure the names match and SDK Server is enabled.")

    # Determine LED counts from the zones themselves (safer than hardcoding)
    count_a = count_b = None
    for dev, zone_a, zone_b in targets:
        set_direct_mode_if_supported(dev)
        if zone_a is not None:
            count_a = len(zone_a.leds)
        if zone_b is not None:
            count_b = len(zone_b.leds)

    if count_a is None or count_b is None:
        raise SystemExit("Found devices but not both zones. Check the exact zone names.")

    # --- Static paint once ---
    if not ANIMATE:
        cols_a = gradient_colors(count_a, phase=0.0)
        cols_b = gradient_colors(count_b, phase=0.0)
        updates = 0
        for dev, zone_a, zone_b in targets:
            set_direct_mode_if_supported(dev)
            if set_zone_colors(zone_a, cols_a):
                updates += 1
            if set_zone_colors(zone_b, cols_b):
                updates += 1
        print(f"Applied static rainbow to {updates} zone(s). In OpenRGB -> Profiles -> Save Profile to store it.")
        return

    # --- Animated flow ---
    print("Animating rainbow. Ctrl+C to stop; then save a snapshot as a profile in OpenRGB.")
    start = time.perf_counter()
    next_frame = start
    frame_time = 1.0 / FPS
    try:
        while True:
            t = time.perf_counter() - start
            phase = (t / FLOW_SECONDS_PER_LOOP) % 1.0  # 0→1 every FLOW_SECONDS_PER_LOOP seconds
            cols_a = gradient_colors(count_a, phase=phase)
            cols_b = gradient_colors(count_b, phase=phase)
            for dev, zone_a, zone_b in targets:
                set_direct_mode_if_supported(dev)
                set_zone_colors(zone_a, cols_a)
                set_zone_colors(zone_b, cols_b)
            next_frame += frame_time
            sleep_for = next_frame - time.perf_counter()
            if sleep_for > 0:
                time.sleep(sleep_for)
            else:
                next_frame = time.perf_counter()
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    main()
