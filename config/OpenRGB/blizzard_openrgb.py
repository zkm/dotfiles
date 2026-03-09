# blizzard_openrgb.py
from openrgb import OpenRGBClient
from openrgb.utils import RGBColor
import os
import random
import time

# ---- config ----
HOST = os.getenv('OPENRGB_SDK_HOST', '127.0.0.1')
PORT = int(os.getenv('OPENRGB_SDK_PORT', '6742'))
ZONE_A_NAME = os.getenv('OPENRGB_ZONE_A', 'ARGB_V2_1/V2.3')
ZONE_B_NAME = os.getenv('OPENRGB_ZONE_B', 'ARGB_V2_2')

ANIMATE = True
FPS = 30

# Blizzard animation tuning
SPAWN_RATE = 2.0            # snowflakes per second per zone
FLAKE_SPEED = 6.5           # LEDs per second
TRAIL_LENGTH = 4.0
TRAIL_DECAY = 0.74
GLOBAL_FADE_PER_SEC = 0.28

# Cool white palette
BASE_RGB = (2, 6, 10)       # very dark icy blue base
MIN_FLAKE = 120
MAX_FLAKE = 235

# Static profile mode (when ANIMATE = False)
STATIC_PRESET = 'blizzard_save'   # blizzard_save | icy_dim | cool_white
# ----------------


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


def scale_color(level):
    # level is 0..255 intensity for cool white/icy blue blend
    t = max(0.0, min(1.0, level / 255.0))
    r = int(BASE_RGB[0] + 200 * t)
    g = int(BASE_RGB[1] + 225 * t)
    b = int(BASE_RGB[2] + 255 * t)
    r = max(0, min(255, r))
    g = max(0, min(255, g))
    b = max(0, min(255, b))
    return RGBColor(r, g, b)


def set_zone_from_levels(zone, levels):
    if zone is None or not levels or len(zone.leds) != len(levels):
        return False
    colors = [scale_color(v) for v in levels]
    zone.set_colors(colors)
    return True


def build_static_levels(count):
    if count <= 0:
        return []

    if STATIC_PRESET == 'cool_white':
        return [180.0] * count

    if STATIC_PRESET == 'icy_dim':
        pattern = [20, 35, 50, 70, 55, 40, 25, 18]
    else:
        # default blizzard_save: visible but still cool and moody for profile saving
        pattern = [30, 55, 85, 130, 180, 220, 170, 110, 70, 45]

    p_len = len(pattern)
    return [float(pattern[i % p_len]) for i in range(count)]


def spawn_flake(state):
    low = min(MIN_FLAKE, MAX_FLAKE)
    high = max(MIN_FLAKE, MAX_FLAKE)
    state['flakes'].append(
        {
            'pos': 0.0,
            'speed': FLAKE_SPEED * random.uniform(0.85, 1.20),
            'head': random.uniform(float(low), float(high)),
        }
    )


def advance_zone(state, dt):
    levels = state['levels']
    if not levels:
        return

    fade = GLOBAL_FADE_PER_SEC ** dt
    for i in range(len(levels)):
        levels[i] = max(0.0, levels[i] * fade)

    expected_spawns = SPAWN_RATE * dt
    spawn_count = int(expected_spawns)
    if random.random() < (expected_spawns - spawn_count):
        spawn_count += 1
    for _ in range(spawn_count):
        spawn_flake(state)

    next_flakes = []
    for flake in state['flakes']:
        flake['pos'] += flake['speed'] * dt
        if flake['pos'] >= len(levels) + TRAIL_LENGTH:
            continue

        head_i = int(flake['pos'])
        frac = flake['pos'] - head_i
        if 0 <= head_i < len(levels):
            levels[head_i] += flake['head'] * (1.0 - frac)
        if 0 <= head_i + 1 < len(levels):
            levels[head_i + 1] += flake['head'] * frac

        for t in range(1, int(TRAIL_LENGTH) + 1):
            idx = int(flake['pos'] - t)
            if 0 <= idx < len(levels):
                levels[idx] += flake['head'] * (TRAIL_DECAY ** t)

        next_flakes.append(flake)

    state['flakes'] = next_flakes

    for i in range(len(levels)):
        if levels[i] > 255.0:
            levels[i] = 255.0


def main():
    try:
        client = OpenRGBClient(HOST, PORT, name='BlizzardScript', protocol_version=2)
    except OSError as exc:
        raise SystemExit(
            f"Could not connect to OpenRGB SDK server at {HOST}:{PORT}.\n"
            "Start it first, for example:\n"
            "  openrgb --noautoconnect --server --loglevel warning\n"
            f"Original error: {exc}"
        )

    targets = []
    for dev in client.devices:
        zone_a = find_zone(dev, ZONE_A_NAME)
        zone_b = find_zone(dev, ZONE_B_NAME)
        if zone_a is not None or zone_b is not None:
            set_direct_mode_if_supported(dev)
            targets.append((zone_a, zone_b))

    if not targets:
        raise SystemExit('Could not find configured zones. Check zone names.')

    count_a = count_b = 0
    for zone_a, zone_b in targets:
        if zone_a is not None:
            count_a = max(count_a, len(zone_a.leds))
        if zone_b is not None:
            count_b = max(count_b, len(zone_b.leds))

    if count_a <= 0 and count_b <= 0:
        raise SystemExit('Configured zones have no LEDs. Check wiring/zone names.')

    state_a = {'levels': [0.0] * count_a, 'flakes': []}
    state_b = {'levels': [0.0] * count_b, 'flakes': []}

    active = []
    if count_a > 0:
        active.append(f"{ZONE_A_NAME} ({count_a})")
    if count_b > 0:
        active.append(f"{ZONE_B_NAME} ({count_b})")
    print('Active blizzard zones: ' + ', '.join(active))

    if not ANIMATE:
        state_a['levels'] = build_static_levels(count_a)
        state_b['levels'] = build_static_levels(count_b)
        updates = 0
        for zone_a, zone_b in targets:
            if set_zone_from_levels(zone_a, state_a['levels']):
                updates += 1
            if set_zone_from_levels(zone_b, state_b['levels']):
                updates += 1
        print(f"Applied static '{STATIC_PRESET}' blizzard colors to {updates} zone(s).")
        return

    print('Animating cool white blizzard. Press Ctrl+C to stop.')
    frame_time = 1.0 / FPS
    next_frame = time.perf_counter()
    last_t = next_frame

    try:
        while True:
            now = time.perf_counter()
            dt = now - last_t
            if dt < 0:
                dt = frame_time
            if dt > 0.2:
                dt = 0.2
            last_t = now

            advance_zone(state_a, dt)
            advance_zone(state_b, dt)

            for zone_a, zone_b in targets:
                set_zone_from_levels(zone_a, state_a['levels'])
                set_zone_from_levels(zone_b, state_b['levels'])

            next_frame += frame_time
            now = time.perf_counter()
            while next_frame < now:
                next_frame += frame_time
            sleep_for = next_frame - time.perf_counter()
            if sleep_for > 0:
                time.sleep(sleep_for)
            else:
                next_frame = time.perf_counter()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
