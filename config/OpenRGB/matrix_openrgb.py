# matrix_openrgb.py
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
SPAWN_RATE = 2.2            # expected new drops per second, per zone
DROP_SPEED = 9.0            # LEDs per second
TAIL_LENGTH = 5.5           # higher value gives longer trail
TAIL_DECAY = 0.62           # lower is shorter and darker trail
GLOBAL_FADE_PER_SEC = 0.22  # lower value fades older light more quickly
BASE_GREEN = 3              # very faint ambient green
MIN_HEAD = 95               # minimum falling head brightness
MAX_GREEN = 175
STATIC_PRESET = "matrix_ladder"  # used when ANIMATE = False
MATRIX_LADDER = [0, 2, 4, 7, 10, 15, 24, 38, 22, 11, 6, 3]
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


def set_zone_from_levels(zone, levels):
    if zone is None or not levels or len(zone.leds) != len(levels):
        return False
    colors = [RGBColor(0, max(BASE_GREEN, int(v)), 0) for v in levels]
    zone.set_colors(colors)
    return True


def build_static_levels(count):
    if count <= 0:
        return []

    if STATIC_PRESET == "solid_green":
        return [float(70)] * count

    # Repeating matrix-like green ladder with bright accents for profile saving.
    ladder_len = len(MATRIX_LADDER)
    return [float(MATRIX_LADDER[i % ladder_len]) for i in range(count)]


def spawn_drop(state):
    low = min(MIN_HEAD, MAX_GREEN)
    high = max(MIN_HEAD, MAX_GREEN)
    state['drops'].append(
        {
            'pos': 0.0,
            'speed': DROP_SPEED * random.uniform(0.93, 1.08),
            'head': random.uniform(float(low), float(high)),
        }
    )


def advance_zone(state, dt):
    levels = state['levels']
    if not levels:
        return

    # Keep existing light and fade it smoothly over time instead of hard-reset each frame.
    fade = GLOBAL_FADE_PER_SEC ** dt
    for i in range(len(levels)):
        levels[i] = max(float(BASE_GREEN), levels[i] * fade)

    # Spawn count is based on elapsed time, not frame count, to avoid jitter.
    expected_spawns = SPAWN_RATE * dt
    spawn_count = int(expected_spawns)
    if random.random() < (expected_spawns - spawn_count):
        spawn_count += 1
    for _ in range(spawn_count):
        spawn_drop(state)

    next_drops = []
    for drop in state['drops']:
        drop['pos'] += drop['speed'] * dt
        if drop['pos'] >= len(levels) + TAIL_LENGTH:
            continue

        # Fractional head position gives smoother perceived motion.
        head_i = int(drop['pos'])
        frac = drop['pos'] - head_i
        if 0 <= head_i < len(levels):
            levels[head_i] += drop['head'] * (1.0 - frac)
        if 0 <= head_i + 1 < len(levels):
            levels[head_i + 1] += drop['head'] * frac

        # Render a soft decaying tail behind the head.
        for t in range(1, int(TAIL_LENGTH) + 1):
            idx = int(drop['pos'] - t)
            if 0 <= idx < len(levels):
                levels[idx] += drop['head'] * (TAIL_DECAY ** t)

        next_drops.append(drop)

    state['drops'] = next_drops

    for i in range(len(levels)):
        if levels[i] > MAX_GREEN:
            levels[i] = float(MAX_GREEN)



def main():
    try:
        client = OpenRGBClient(HOST, PORT, name='MatrixScript', protocol_version=2)
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
            targets.append((dev, zone_a, zone_b))

    if not targets:
        raise SystemExit(
            "Could not find your ARGB zones. Check zone names and verify devices are detected."
        )

    count_a = count_b = None
    for _, zone_a, zone_b in targets:
        if zone_a is not None:
            count_a = len(zone_a.leds)
        if zone_b is not None:
            count_b = len(zone_b.leds)

    if count_a is None and count_b is None:
        raise SystemExit("Could not find either configured zone. Check exact zone names.")

    count_a = count_a or 0
    count_b = count_b or 0

    if count_a <= 0 and count_b <= 0:
        raise SystemExit(
            f"Configured zones have no LEDs (A={count_a}, B={count_b}). "
            "Check connections or zone names in the script."
        )

    state_a = {'levels': [float(BASE_GREEN)] * count_a, 'drops': []}
    state_b = {'levels': [float(BASE_GREEN)] * count_b, 'drops': []}

    active = []
    if count_a > 0:
        active.append(f"{ZONE_A_NAME} ({count_a})")
    if count_b > 0:
        active.append(f"{ZONE_B_NAME} ({count_b})")
    print("Active matrix zones: " + ", ".join(active))

    if not ANIMATE:
        state_a['levels'] = build_static_levels(count_a)
        state_b['levels'] = build_static_levels(count_b)
        updates = 0
        for dev, zone_a, zone_b in targets:
            if set_zone_from_levels(zone_a, state_a['levels']):
                updates += 1
            if set_zone_from_levels(zone_b, state_b['levels']):
                updates += 1
        print(f"Applied static '{STATIC_PRESET}' matrix colors to {updates} zone(s).")
        return

    print('Animating Matrix green effect. Press Ctrl+C to stop.')
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

            for dev, zone_a, zone_b in targets:
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
