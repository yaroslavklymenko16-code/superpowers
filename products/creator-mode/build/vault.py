"""Builds the Creator Vault: Roblox model packs (.rbxmx) + a JSON catalog for the 3D viewer.

Run:  python3 build/vault.py
Out:  vault/*.rbxmx, build/vault_catalog.json, build/vault_scripts/*.luau (for syntax checks)
"""
import json, math, os, random
from xml.sax.saxutils import escape
from vault_scripts import S

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "vault")
random.seed(7)

MATERIAL = {
    "Plastic": 256, "SmoothPlastic": 272, "Neon": 288, "Wood": 512, "WoodPlanks": 528,
    "Marble": 784, "Slate": 800, "Concrete": 816, "Granite": 832, "Brick": 848, "Pebble": 864,
    "Cobblestone": 880, "CorrodedMetal": 1040, "DiamondPlate": 1056, "Foil": 1072, "Metal": 1088,
    "Grass": 1280, "Sand": 1296, "Fabric": 1312, "Ice": 1536, "Glass": 1568, "ForceField": 1584,
}
SHAPE = {"ball": 0, "block": 1, "cyl": 2}

# ---------- geometry helpers ----------

def rot_matrix(rx, ry, rz):
    """CFrame.Angles(rx, ry, rz) in degrees -> 3x3 row-major (R = Rx * Ry * Rz)."""
    a, b, c = (math.radians(v) for v in (rx, ry, rz))
    ca, sa, cb, sb, cc, sc = math.cos(a), math.sin(a), math.cos(b), math.sin(b), math.cos(c), math.sin(c)
    Rx = [[1, 0, 0], [0, ca, -sa], [0, sa, ca]]
    Ry = [[cb, 0, sb], [0, 1, 0], [-sb, 0, cb]]
    Rz = [[cc, -sc, 0], [sc, cc, 0], [0, 0, 1]]
    mul = lambda A, B: [[sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
    return mul(mul(Rx, Ry), Rz)

def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def P(name, size, pos, color, mat="SmoothPlastic", shape="block", rot=(0, 0, 0), **kw):
    d = dict(name=name, size=size, pos=pos, color=color, mat=mat, shape=shape, rot=rot)
    d.update(kw)
    return d

def VC(name, length, diameter, pos, color, mat="SmoothPlastic", **kw):
    """Vertical cylinder (Roblox cylinders point along X, so tip it up)."""
    rot = kw.pop("rot", (0, 0, 90))
    return P(name, (length, diameter, diameter), pos, color, mat, "cyl", rot, **kw)

def Ball(name, d, pos, color, mat="SmoothPlastic", **kw):
    return P(name, (d, d, d), pos, color, mat, "ball", **kw)

# ---------- catalog ----------
CATALOG = []  # (pack, model_name, description, parts, model_script, kind)

def add(pack, name, desc, parts, script=None, kind="Model"):
    CATALOG.append(dict(pack=pack, name=name, desc=desc, parts=parts, script=script, kind=kind))

G1, G2, G3 = "#4caf50", "#2e7d32", "#7cc642"
BARK, DARK_BARK = "#7a5230", "#4e3420"

# NATURE
def oak(c1, c2, c3, name, desc):
    add("Nature", name, desc, [
        VC("Trunk", 8, 1.8, (0, 4, 0), BARK, "Wood"),
        Ball("Leaves", 8, (0, 10, 0), c1, "Grass"),
        Ball("Leaves", 6, (2.8, 8.6, 1), c2, "Grass"),
        Ball("Leaves", 6, (-2.6, 9, -1.4), c3, "Grass"),
        Ball("Leaves", 5, (0.6, 12.6, -0.8), c2, "Grass"),
    ])
oak(G1, G2, G3, "Oak Tree", "Big leafy tree")
oak("#ff9f1c", "#e85d04", "#ffbf47", "Autumn Tree", "Orange fall tree")
oak("#ffb7d5", "#ff8fbf", "#ffd6e7", "Blossom Tree", "Pink cherry blossom")
oak("#9be15d", "#6cc04a", "#c3f584", "Bright Tree", "Cartoon lime tree")

add("Nature", "Pine Tree", "Tall evergreen", [VC("Trunk", 4, 1.4, (0, 2, 0), DARK_BARK, "Wood")] + [
    VC("Needles", 2.2, d, (0, 4 + i * 2.2, 0), "#1b5e20" if i % 2 else "#2e7d32", "Grass")
    for i, d in enumerate([9, 7.4, 5.8, 4.2, 2.6])])
add("Nature", "Snowy Pine", "Pine with snow caps", [VC("Trunk", 4, 1.4, (0, 2, 0), DARK_BARK, "Wood")] + sum([[
    VC("Needles", 2.2, d, (0, 4 + i * 2.6, 0), "#1b5e20", "Grass"),
    VC("Snow", 0.5, d * 0.8, (0, 5.3 + i * 2.6, 0), "#f5fbff", "Ice")] for i, d in enumerate([9, 7, 5, 3])], []))

palm = [VC("Trunk", 2.2, 1.4 - i * 0.08, (i * 0.5, 1.1 + i * 2.1, 0), "#a47148" if i % 2 else "#8d5f3a", "Wood", rot=(0, 0, 90 - i * 4)) for i in range(6)]
for k in range(6):
    a = k * 60
    palm.append(P("Leaf", (6, 0.3, 1.6), (3 + math.cos(math.radians(a)) * 3, 12.5, math.sin(math.radians(a)) * 3), "#2fa84f", "Grass", rot=(0, -a, -20)))
palm += [Ball("Coconut", 1, (3.6, 11.6, 0.6), "#5d4037"), Ball("Coconut", 1, (2.6, 11.6, -0.6), "#5d4037")]
add("Nature", "Palm Tree", "Beach palm with coconuts", palm)

add("Nature", "Birch Tree", "White birch", [VC("Trunk", 10, 1.2, (0, 5, 0), "#f1f1ec", "Wood")] +
    [P("Mark", (0.3, 0.3, 1.25), (0, 1.5 + i * 1.6, 0), "#222222", rot=(0, i * 50, 0)) for i in range(5)] +
    [P("Leaves", (4, 3, 4), (0.5, 11, 0), "#c5e17a", "Grass", rot=(0, 20, 0)), P("Leaves", (3, 3, 3), (-1, 13, 0.5), "#a8d05a", "Grass", rot=(0, 50, 0))])

add("Nature", "Dead Tree", "Spooky bare tree", [
    VC("Trunk", 9, 1.4, (0, 4.5, 0), "#5b4a3f", "Wood"),
    P("Branch", (5, 0.6, 0.6), (2, 7, 0), "#5b4a3f", "Wood", rot=(0, 0, 35)),
    P("Branch", (4, 0.5, 0.5), (-1.6, 8, 0.6), "#5b4a3f", "Wood", rot=(0, 30, -40)),
    P("Branch", (3, 0.4, 0.4), (0.4, 9.6, -1), "#5b4a3f", "Wood", rot=(0, -60, 50))])
add("Nature", "Bush", "Round shrub", [Ball("Bush", 3.5, (0, 1.5, 0), G1, "Grass"), Ball("Bush", 3, (1.6, 1.2, 0.4), G2, "Grass"), Ball("Bush", 2.6, (-1.4, 1.1, -0.4), G3, "Grass")])
add("Nature", "Berry Bush", "Bush with red berries", [Ball("Bush", 3.6, (0, 1.6, 0), G2, "Grass")] + [Ball("Berry", 0.5, (math.cos(i) * 1.6, 1.6 + math.sin(i * 2) * 0.8, math.sin(i) * 1.6), "#e53935") for i in range(8)])
for fname, fc in [("Red Flower", "#ff3b3b"), ("Yellow Flower", "#ffd23f"), ("Purple Flower", "#a259ff")]:
    add("Nature", fname, "Little flower", [VC("Stem", 2, 0.2, (0, 1, 0), "#3a9d23"), Ball("Center", 0.5, (0, 2.1, 0), "#ffcc00" if fc != "#ffd23f" else "#8d5f3a")] +
        [Ball("Petal", 0.6, (math.cos(i * 1.2566) * 0.45, 2.1, math.sin(i * 1.2566) * 0.45), fc) for i in range(5)])
for rname, sc in [("Small Rock", 1), ("Big Rock", 2.2), ("Boulder", 3.5)]:
    add("Nature", rname, "Chunky rock", [
        P("Rock", (3 * sc, 2 * sc, 2.6 * sc), (0, 0.9 * sc, 0), "#8a8f98", "Slate", rot=(8, 20, 5)),
        P("Rock", (2 * sc, 1.6 * sc, 2 * sc), (1.2 * sc, 0.7 * sc, 0.8 * sc), "#9aa0a8", "Slate", rot=(-10, 50, 12))])
add("Nature", "Red Mushroom", "Toadstool", [VC("Stalk", 2, 1, (0, 1, 0), "#f5f0e1"), VC("Cap", 0.8, 3, (0, 2.3, 0), "#e53935")] +
    [Ball("Dot", 0.45, (math.cos(i * 2.1) * 0.9, 2.75, math.sin(i * 2.1) * 0.9), "#ffffff") for i in range(3)])
add("Nature", "Glow Mushroom", "Glowing cave mushroom", [VC("Stalk", 2.4, 0.8, (0, 1.2, 0), "#d9f7ff"), VC("Cap", 0.8, 2.6, (0, 2.7, 0), "#29e7ff", "Neon", light="#29e7ff")])
add("Nature", "Log", "Fallen log", [P("Log", (7, 1.8, 1.8), (0, 0.9, 0), BARK, "Wood", "cyl"), P("End", (0.1, 1.5, 1.5), (3.52, 0.9, 0), "#d7b98e", "Wood", "cyl")])
add("Nature", "Stump", "Tree stump", [VC("Stump", 1.6, 2.4, (0, 0.8, 0), BARK, "Wood"), VC("Top", 0.1, 2.2, (0, 1.62, 0), "#d7b98e", "Wood")])
add("Nature", "Cactus", "Desert cactus", [VC("Body", 7, 1.6, (0, 3.5, 0), "#3a9d23"), P("Arm", (2, 1, 1), (1.4, 3.5, 0), "#3a9d23"), VC("ArmUp", 2, 1, (2.2, 4.5, 0), "#3a9d23"), P("Arm", (1.6, 0.9, 0.9), (-1.2, 2.6, 0), "#3a9d23"), VC("ArmUp", 1.6, 0.9, (-1.9, 3.3, 0), "#3a9d23")])
add("Nature", "Lily Pad", "For ponds", [VC("Pad", 0.2, 3, (0, 0.1, 0), "#43a047"), Ball("Flower", 0.7, (0.6, 0.4, 0.3), "#ff9ec7")])
add("Nature", "Grass Tuft", "Tall grass", [P("Blade", (0.15, 1.6 + (i % 3) * 0.4, 0.4), (math.cos(i) * 0.4, 0.9, math.sin(i) * 0.4), G3 if i % 2 else G1, "Grass", rot=(0, i * 40, 10 - i * 3)) for i in range(7)])

# BUILDINGS
def roof(width, depth, y, color, mat="Slate", pitch=35, x=0, z=0):
    half = width / 2
    slab = half / math.cos(math.radians(pitch)) + 0.6
    rise = math.tan(math.radians(pitch)) * half / 2
    return [P("Roof", (slab, 0.6, depth + 1), (x - half / 2, y + rise, z), color, mat, rot=(0, 0, pitch)),
            P("Roof", (slab, 0.6, depth + 1), (x + half / 2, y + rise, z), color, mat, rot=(0, 0, -pitch))]

cottage = [P("Floor", (14, 0.5, 10), (0, 0.25, 0), "#8d6e63", "WoodPlanks"),
           P("Wall", (14, 8, 0.6), (0, 4.5, 4.7), "#f4e1c1", "Brick"),
           P("Wall", (0.6, 8, 10), (-6.7, 4.5, 0), "#f4e1c1", "Brick"),
           P("Wall", (0.6, 8, 10), (6.7, 4.5, 0), "#f4e1c1", "Brick"),
           P("Wall", (4.5, 8, 0.6), (-4.75, 4.5, -4.7), "#f4e1c1", "Brick"),
           P("Wall", (4.5, 8, 0.6), (4.75, 4.5, -4.7), "#f4e1c1", "Brick"),
           P("Wall", (5, 2, 0.6), (0, 7.5, -4.7), "#f4e1c1", "Brick"),
           P("Door", (5, 6, 0.4), (0, 3.5, -4.7), "#6d4c41", "Wood", script="door"),
           P("Window", (2.5, 2.5, 0.7), (-4.6, 5, -4.7), "#a7d8ff", "Glass", transparency=0.4),
           P("Window", (2.5, 2.5, 0.7), (4.6, 5, -4.7), "#a7d8ff", "Glass", transparency=0.4),
           P("Chimney", (1.6, 4, 1.6), (4, 11, 2), "#9e4a3a", "Brick")] + roof(14, 10, 8.5, "#c0392b")
add("Buildings", "Cottage", "House with a working door (press E)", cottage)

tower = [VC("Tower", 20, 10, (0, 10, 0), "#b0b4ba", "Cobblestone"), VC("Top", 1, 11.5, (0, 20.5, 0), "#9ea2a8", "Cobblestone")]
tower += [P("Battlement", (1.6, 1.6, 1.6), (math.cos(i * math.pi / 5) * 5.2, 21.8, math.sin(i * math.pi / 5) * 5.2), "#9ea2a8", "Cobblestone", rot=(0, -i * 36, 0)) for i in range(10)]
tower += [VC("Pole", 5, 0.3, (0, 23.5, 0), "#555555"), P("Flag", (0.1, 1.6, 2.6), (0, 25, 1.3), "#e53935", "Fabric"), P("Door", (3, 5, 0.6), (0, 2.5, -5), "#5d4037", "Wood")]
add("Buildings", "Castle Tower", "Round stone tower with flag", tower)

wall = [P("Wall", (20, 10, 3), (0, 5, 0), "#a9adb3", "Cobblestone")] + [P("Battlement", (2, 2, 3), (-9 + i * 4.5, 11, 0), "#a9adb3", "Cobblestone") for i in range(5)]
add("Buildings", "Castle Wall", "Stack them to build a castle", wall)
add("Buildings", "Castle Gate", "Big gate with portcullis", [
    P("Pillar", (4, 14, 4), (-6, 7, 0), "#a9adb3", "Cobblestone"), P("Pillar", (4, 14, 4), (6, 7, 0), "#a9adb3", "Cobblestone"),
    P("Top", (16, 4, 4), (0, 12, 0), "#a9adb3", "Cobblestone")] +
    [P("Bar", (0.4, 10, 0.4), (-3.5 + i, 5, 0), "#3b3b3b", "Metal", cancollide=False) for i in range(8)])
add("Buildings", "Bridge", "Wooden bridge", [P("Plank", (3.8, 0.4, 1.2), (0, 2, -7 + i * 1.4), "#a1887f" if i % 2 else "#8d6e63", "WoodPlanks") for i in range(11)] +
    [P("Rail", (0.4, 0.4, 16), (s * 2, 3.6, 0), "#6d4c41", "Wood") for s in (-1, 1)] +
    [VC("Post", 3.6, 0.5, (s * 2, 1.8, z), "#6d4c41", "Wood") for s in (-1, 1) for z in (-7.5, 0, 7.5)])
add("Buildings", "Fence", "Picket fence section", [P("Picket", (0.8, 3, 0.3), (-4 + i * 1.6, 1.5, 0), "#ffffff") for i in range(6)] + [P("Rail", (10, 0.4, 0.2), (0, y, -0.2), "#eeeeee") for y in (1, 2.2)])
add("Buildings", "Stairs", "Climb up 6 steps", [P("Step", (6, 1, 2), (0, 0.5 + i, i * 2), "#bdbdbd", "Concrete") for i in range(6)])
hut = [VC("Wall", 6, 9, (0, 3, 0), "#c8a26b", "Wood")] + [VC("Roof", 1.4, d, (0, 6.7 + i * 1.3, 0), "#b5651d" if i % 2 else "#d2a24c", "Fabric") for i, d in enumerate([11, 9, 7, 5, 3, 1.4])]
hut += [P("Door", (2.6, 4, 0.6), (0, 2, -4.4), "#5d4037", "Wood")]
add("Buildings", "Hut", "Round straw hut", hut)
stand = [P("Counter", (8, 3, 2.5), (0, 1.5, 0), "#8d6e63", "WoodPlanks")] + [VC("Post", 7, 0.5, (x, 3.5, z), "#6d4c41", "Wood") for x in (-3.8, 3.8) for z in (-1, 1)]
stand += [P("Awning", (1.6, 0.3, 4), (-3.2 + i * 1.6, 7.2, -0.6), "#e53935" if i % 2 == 0 else "#ffffff", "Fabric", rot=(15, 0, 0)) for i in range(5)]
add("Buildings", "Shop Stand", "Market stall", stand)
add("Buildings", "Well", "Wishing well", [VC("Ring", 3, 6, (0, 1.5, 0), "#9e9e9e", "Cobblestone"), VC("Water", 0.2, 5, (0, 2.6, 0), "#4fc3f7", "Glass", transparency=0.3),
    VC("Post", 6, 0.5, (-2.6, 3, 0), "#6d4c41", "Wood"), VC("Post", 6, 0.5, (2.6, 3, 0), "#6d4c41", "Wood"),
    P("Beam", (6, 0.4, 0.4), (0, 5.6, 0), "#6d4c41", "Wood")] + roof(7, 4, 6, "#8d3b2a", "WoodPlanks"))
watch = [VC("Leg", 12, 0.8, (x, 6, z), "#6d4c41", "Wood") for x in (-3, 3) for z in (-3, 3)]
watch += [P("Deck", (8, 0.6, 8), (0, 12, 0), "#8d6e63", "WoodPlanks")] + roof(8, 8, 17, "#4e342e", "WoodPlanks")
watch += [P("Rail", (8, 1.5, 0.3), (0, 13, 3.9), "#6d4c41", "Wood"), P("Rail", (8, 1.5, 0.3), (0, 13, -3.9), "#6d4c41", "Wood"), P("Rail", (0.3, 1.5, 8), (3.9, 13, 0), "#6d4c41", "Wood")]
watch += [VC("Post", 5, 0.4, (x, 14.5, z), "#6d4c41", "Wood") for x in (-3.8, 3.8) for z in (-3.8, 3.8)]
watch += [P("Ladder", (2, 12, 2), (-5, 6, 0), "#9e9e9e", "Metal", cls="TrussPart")]
add("Buildings", "Watchtower", "Lookout with climbable ladder", watch)
add("Buildings", "Stone Arch", "Decorative archway", [P("Pillar", (2.5, 9, 2.5), (-4, 4.5, 0), "#c9c2b0", "Marble"), P("Pillar", (2.5, 9, 2.5), (4, 4.5, 0), "#c9c2b0", "Marble"), P("Top", (11, 2, 3), (0, 10, 0), "#c9c2b0", "Marble")])
add("Buildings", "Shed", "Small tool shed", [P("Body", (6, 6, 5), (0, 3, 0), "#7d9a5b", "WoodPlanks"), P("Door", (2.4, 4.4, 0.2), (0, 2.2, -2.55), "#5b7044", "Wood", script="door")] + roof(6, 5, 6, "#555b63", "Metal", 25))

# PROPS
add("Props", "Crate", "Wooden crate", [P("Crate", (3, 3, 3), (0, 1.5, 0), "#b07c4a", "WoodPlanks")] + [P("Edge", (3.1, 0.4, 0.4), (0, y, z), "#7a5230", "Wood") for y in (0.2, 2.8) for z in (-1.4, 1.4)])
add("Props", "Crate Stack", "Pile of crates", [P("Crate", (3, 3, 3), (0, 1.5, 0), "#b07c4a", "WoodPlanks"), P("Crate", (3, 3, 3), (3.1, 1.5, 0.3), "#a06c3a", "WoodPlanks", rot=(0, 10, 0)), P("Crate", (3, 3, 3), (1.5, 4.5, 0.1), "#c08c5a", "WoodPlanks", rot=(0, -15, 0))])
add("Props", "Barrel", "Wooden barrel", [VC("Barrel", 3.5, 2.6, (0, 1.75, 0), "#8d5f3a", "WoodPlanks")] + [VC("Band", 0.3, 2.7, (0, y, 0), "#444444", "Metal") for y in (0.6, 2.9)])
add("Props", "Toxic Barrel", "Glowing green barrel", [VC("Barrel", 3.5, 2.6, (0, 1.75, 0), "#f2c94c", "Metal"), VC("Goo", 0.2, 2.2, (0, 3.55, 0), "#76ff03", "Neon", light="#76ff03")])
add("Props", "Bench", "Park bench", [P("Seat", (6, 0.4, 1.8), (0, 1.8, 0), "#a1887f", "WoodPlanks"), P("Back", (6, 1.6, 0.3), (0, 3, 0.9), "#a1887f", "WoodPlanks", rot=(-10, 0, 0))] + [P("Leg", (0.4, 1.6, 1.6), (x, 0.8, 0), "#424242", "Metal") for x in (-2.6, 2.6)])
add("Props", "Picnic Table", "Table with benches", [P("Top", (6, 0.4, 3), (0, 2.6, 0), "#b07c4a", "WoodPlanks")] + [P("Bench", (6, 0.3, 1), (0, 1.5, z), "#a06c3a", "WoodPlanks") for z in (-2.2, 2.2)] + [P("Leg", (0.4, 2.6, 5.4), (x, 1.3, 0), "#7a5230", "Wood") for x in (-2.4, 2.4)])
add("Props", "Chair", "Simple chair", [P("Seat", (2, 0.3, 2), (0, 1.6, 0), "#8d6e63", "Wood"), P("Back", (2, 2, 0.3), (0, 2.7, 0.85), "#8d6e63", "Wood")] + [P("Leg", (0.3, 1.5, 0.3), (x, 0.75, z), "#6d4c41", "Wood") for x in (-0.8, 0.8) for z in (-0.8, 0.8)])
add("Props", "Lamp Post", "Street lamp that glows", [VC("Pole", 10, 0.5, (0, 5, 0), "#2f2f35", "Metal"), VC("Base", 0.6, 1.6, (0, 0.3, 0), "#2f2f35", "Metal"), P("Lamp", (1.4, 1.4, 1.4), (0, 10.5, 0), "#fff3c4", "Neon", light="#ffe9a8")])
add("Props", "Campfire", "Crackling fire with light", [P("Log", (3.4, 0.6, 0.6), (0, 0.4, 0), BARK, "Wood", "cyl", rot=(0, a, 0)) for a in (0, 60, 120)] + [P("Fire", (1, 0.5, 1), (0, 0.8, 0), "#ff8a00", "Neon", fire=True, light="#ff9a3c", cancollide=False, transparency=1)] +
    [P("Stone", (0.8, 0.6, 0.8), (math.cos(i * 0.785) * 2, 0.3, math.sin(i * 0.785) * 2), "#8a8f98", "Slate", rot=(0, i * 20, 0)) for i in range(8)])
add("Props", "Torch", "Wall or ground torch", [VC("Stick", 4, 0.4, (0, 2, 0), "#6d4c41", "Wood"), P("Head", (0.7, 0.7, 0.7), (0, 4.2, 0), "#ffb300", "Neon", fire=True, light="#ff9a3c")])
add("Props", "Signpost", "Write on it!", [VC("Post", 5, 0.5, (0, 2.5, 0), "#6d4c41", "Wood"), P("Sign", (4, 1.6, 0.3), (0, 4.4, 0), "#d7b98e", "WoodPlanks")])
add("Props", "Mailbox", "Neighborhood mailbox", [VC("Post", 3, 0.4, (0, 1.5, 0), "#555555", "Metal"), P("Box", (1.2, 1.2, 2), (0, 3.6, 0), "#1e88e5", "Metal"), P("Flag", (0.1, 0.8, 0.3), (0.65, 3.9, 0.5), "#e53935")])
add("Props", "Trash Can", "Street bin", [VC("Can", 3, 1.8, (0, 1.5, 0), "#607d8b", "Metal"), VC("Lid", 0.3, 2, (0, 3.15, 0), "#546e7a", "Metal")])
add("Props", "Traffic Cone", "Orange cone", [P("Base", (1.6, 0.2, 1.6), (0, 0.1, 0), "#ff6d00")] + [VC("Cone", 0.5, 1.2 - i * 0.2, (0, 0.45 + i * 0.5, 0), "#ff6d00" if i != 2 else "#ffffff") for i in range(5)])
add("Props", "Tire Stack", "Pile of tires", [VC("Tire", 0.8, 2.6, (0, 0.4 + i * 0.8, 0), "#222222", "Fabric") for i in range(4)])
add("Props", "Hay Bale", "Farm hay", [P("Hay", (4, 2.2, 2.4), (0, 1.1, 0), "#e6c35c", "Fabric")])
add("Props", "Treasure Pile", "Heap of gold", [Ball("Gold", 1 + (i % 3) * 0.4, (math.cos(i * 1.3) * (i % 4) * 0.5, 0.4 + (i % 2) * 0.6, math.sin(i * 1.3) * (i % 4) * 0.5), "#ffc107", "Foil") for i in range(14)])
add("Props", "Fire Hydrant", "City hydrant", [VC("Body", 2.4, 1.1, (0, 1.2, 0), "#e53935", "Metal"), Ball("Top", 1.1, (0, 2.4, 0), "#e53935", "Metal"), P("Nozzle", (1.8, 0.5, 0.5), (0, 1.6, 0), "#c62828", "Metal", "cyl")])
add("Props", "Clay Pot", "Plant pot", [VC("Pot", 1.8, 2, (0, 0.9, 0), "#c1663b"), Ball("Plant", 1.8, (0, 2.3, 0), G1, "Grass")])

# OBBY PACK (scripted)
add("Obby", "Kill Brick", "Touch = knocked out", [P("Kill Brick", (8, 1, 8), (0, 0.5, 0), "#ff2a2a", "Neon", script="kill")])
add("Obby", "Lava Floor", "Big lava sheet", [P("Lava", (40, 1, 40), (0, 0.5, 0), "#ff5a14", "Neon", script="kill")])
add("Obby", "Damage Spikes", "Hurts 20 health", [P("Base", (6, 0.4, 6), (0, 0.2, 0), "#555555", "Metal", script="damage")] + [P("Spike", (0.6, 1.6, 0.6), (-2 + (i % 3) * 2, 1.2, -2 + (i // 3) * 2), "#cfd8dc", "Metal", rot=(0, 45, 0)) for i in range(9)])
for n in (1, 2, 3):
    add("Obby", f"Checkpoint {n}", "Respawn here. Rename the number for more", [P(f"Checkpoint {n}", (8, 1, 8), (0, 0.5, 0), "#40ff80", "Neon", script="checkpoint"), VC("Pole", 6, 0.3, (3, 4, 3), "#eeeeee"), P("Flag", (0.1, 2, 3), (3, 6, 1.5), "#40ff80", "Neon", cancollide=False)])
add("Obby", "Moving Platform", "Slides side to side, carries you", [P("Moving Platform", (8, 1, 8), (0, 0.5, 0), "#2f6bff", "SmoothPlastic", script="slider")])
add("Obby", "Elevator", "Goes up and down", [P("Elevator", (8, 1, 8), (0, 0.5, 0), "#7c4dff", "Neon", script="elevator")])
add("Obby", "Spinner", "Spinning laser bar", [VC("Pillar", 3, 1.6, (0, 1.5, 0), "#333333", "Metal"), P("Laser", (18, 0.8, 0.8), (0, 3.4, 0), "#ff1744", "Neon", script="spinner", cancollide=False)])
add("Obby", "Vanishing Block", "Fades when you step on it", [P("Vanishing Block", (6, 1, 6), (0, 0.5, 0), "#80deea", "Glass", transparency=0.2, script="vanish")])
add("Obby", "Jump Pad", "Launches you up", [VC("Jump Pad", 0.6, 6, (0, 0.3, 0), "#ffea00", "Neon", script="jumppad")])
add("Obby", "Speed Pad", "Super speed", [P("Speed Pad", (6, 0.4, 6), (0, 0.2, 0), "#00e5ff", "Neon", script="speedpad")] + [P("Arrow", (1, 0.1, 2.4), (x, 0.45, 0), "#ffffff", "Neon", rot=(0, 0, 0)) for x in (-1.5, 1.5)])
add("Obby", "Conveyor", "Pushes you forward", [P("Conveyor", (6, 1, 20), (0, 0.5, 0), "#212121", "DiamondPlate", script="conveyor")])
add("Obby", "Truss Tower", "Climbable tower", [P("Truss", (2, 20, 2), (0, 10, 0), "#9e9e9e", "Metal", cls="TrussPart"), P("Top", (6, 1, 6), (0, 20.5, 0), "#ffffff")])
add("Obby", "Win Pad", "Finish line: +1 Win", [P("Win Pad", (12, 1, 12), (0, 0.5, 0), "#ffd23f", "Neon", script="winpad", sparkles=True, light="#ffe066")])
add("Obby", "Laser Gate", "Blinks on and off", [P("Post", (1, 8, 1), (-5, 4, 0), "#37474f", "Metal"), P("Post", (1, 8, 1), (5, 4, 0), "#37474f", "Metal")] + [P("Laser", (9, 0.4, 0.4), (0, 1 + i * 1.5, 0), "#ff1744", "Neon", cancollide=False, script="lasergate") for i in range(5)])
add("Obby", "Key Door", "Needs a Key to open", [P("Frame", (8, 10, 1), (0, 5, 0.6), "#5d4037", "Wood", transparency=1, cancollide=False), P("Key Door", (6, 9, 1), (0, 4.5, 0), "#ffb300", "Metal", script="keydoor")])

# COLLECTIBLES (scripted)
add("Collectibles", "Coin", "+1 Coin, respawns", [P("Coin", (0.4, 3, 3), (0, 3, 0), "#ffcd28", "Neon", "cyl", cancollide=False, script="coin")])
add("Collectibles", "Blue Gem", "+5 Coins", [P("Gem", (1.6, 1.6, 1.6), (0, 3, 0), "#29b6f6", "Glass", rot=(45, 0, 45), cancollide=False, script="gem_blue")])
add("Collectibles", "Red Gem", "+10 Coins", [P("Gem", (1.8, 1.8, 1.8), (0, 3, 0), "#ff1744", "Glass", rot=(45, 0, 45), cancollide=False, script="gem_red")])
add("Collectibles", "Green Gem", "+25 Coins", [P("Gem", (2, 2, 2), (0, 3, 0), "#00e676", "Glass", rot=(45, 0, 45), cancollide=False, script="gem_green", sparkles=True)])
add("Collectibles", "Heart", "Heals 50", [Ball("Heart", 1.6, (-0.5, 3.2, 0), "#ff4d6d", "Neon", cancollide=False, script="heart"), Ball("HeartR", 1.6, (0.5, 3.2, 0), "#ff4d6d", "Neon", cancollide=False), P("HeartTip", (1.5, 1.5, 1.2), (0, 2.5, 0), "#ff4d6d", "Neon", rot=(0, 0, 45), cancollide=False)])
add("Collectibles", "Power Star", "Speed + jump for 8s", [P("Star", (2.4, 2.4, 0.6), (0, 3, 0), "#ffe600", "Neon", cancollide=False, script="star"), P("StarB", (2.4, 2.4, 0.6), (0, 3, 0), "#ffe600", "Neon", rot=(0, 0, 45), cancollide=False)])
add("Collectibles", "Key", "Opens Key Doors", [P("Key", (0.4, 2.4, 0.4), (0, 3, 0), "#ffb300", "Foil", cancollide=False, script="key"), P("Ring", (0.4, 1.2, 1.2), (0, 4.4, 0), "#ffb300", "Foil", "cyl", cancollide=False), P("Tooth", (0.4, 0.4, 0.8), (0, 2.1, 0.4), "#ffb300", "Foil", cancollide=False)])
add("Collectibles", "Trophy", "+1 Trophy", [VC("Base", 0.8, 2, (0, 0.4, 0), "#5d4037", "Wood"), VC("Stem", 1.4, 0.5, (0, 1.5, 0), "#ffc107", "Foil"), VC("Cup", 1.6, 1.8, (0, 3, 0), "#ffc107", "Foil", script="trophy")])
add("Collectibles", "Treasure Chest", "Press E: +25 Coins", [P("Box", (4, 2, 2.6), (0, 1, 0), "#8d5f3a", "WoodPlanks"), P("Lid", (4, 0.9, 2.6), (0, 2.45, 0), "#a1704a", "WoodPlanks", script="chest"), P("Lock", (0.6, 0.8, 0.2), (0, 2, -1.35), "#ffc107", "Foil")])

# SCI-FI
add("Sci-Fi", "Portal Pair", "Teleport between two rings", [
    P("PortalA", (0.6, 8, 8), (-12, 4.5, 0), "#00e5ff", "Neon", "cyl", rot=(0, 90, 0), transparency=0.3, cancollide=False, light="#00e5ff"),
    P("PortalB", (0.6, 8, 8), (12, 4.5, 0), "#ff4dff", "Neon", "cyl", rot=(0, 90, 0), transparency=0.3, cancollide=False, light="#ff4dff"),
    P("BaseA", (8, 0.6, 3), (-12, 0.3, 0), "#37474f", "Metal"), P("BaseB", (8, 0.6, 3), (12, 0.3, 0), "#37474f", "Metal")], script="portal")
for cname, cc in [("Blue Crystal", "#40c4ff"), ("Purple Crystal", "#b388ff"), ("Pink Crystal", "#ff80ab")]:
    add("Sci-Fi", cname, "Glowing crystal cluster", [P("Crystal", (1.6, 6, 1.6), (0, 3, 0), cc, "Neon", rot=(0, 45, 0), light=cc),
        P("Crystal", (1.1, 4, 1.1), (1.3, 1.8, 0.4), cc, "Glass", rot=(0, 20, -20)), P("Crystal", (1, 3.4, 1), (-1.2, 1.5, -0.3), cc, "Glass", rot=(15, 0, 25))])
rocket = [VC("Body", 14, 4, (0, 9, 0), "#eceff1", "Metal")] + [VC("Nose", 1.2, 3.6 - i * 0.8, (0, 16.6 + i * 1.2, 0), "#e53935", "Metal") for i in range(4)]
rocket += [P("Fin", (0.4, 4, 3), (math.cos(i * 2.094) * 2.4, 3.5, math.sin(i * 2.094) * 2.4), "#e53935", "Metal", rot=(0, -i * 120, 0)) for i in range(3)]
rocket += [Ball("Window", 1.6, (0, 12, -1.6), "#4fc3f7", "Glass"), VC("Flame", 2, 2.4, (0, 1, 0), "#ff9100", "Neon", cancollide=False, light="#ff9100")]
add("Sci-Fi", "Rocket", "Retro rocket ship", rocket)
add("Sci-Fi", "Satellite Dish", "Big antenna dish", [VC("Pole", 6, 0.8, (0, 3, 0), "#90a4ae", "Metal"), P("Dish", (0.8, 8, 8), (0, 7, 0), "#eceff1", "Metal", "cyl", rot=(0, 0, 60)), VC("Spike", 3, 0.3, (1, 8.3, 0), "#90a4ae", "Metal")])
add("Sci-Fi", "Energy Core", "Glowing power core", [VC("Base", 1, 4, (0, 0.5, 0), "#263238", "Metal"), VC("Core", 5, 2, (0, 3.5, 0), "#00e676", "Neon", light="#00e676"), VC("Cap", 1, 4, (0, 6.5, 0), "#263238", "Metal")] + [VC("Rod", 6, 0.3, (math.cos(i * 1.57) * 1.7, 3.5, math.sin(i * 1.57) * 1.7), "#90a4ae", "Metal") for i in range(4)])
add("Sci-Fi", "Hover Pad", "Glowing launch pad", [VC("Hover Pad", 0.6, 6, (0, 0.3, 0), "#00e5ff", "Neon", script="jumppad"), VC("Ring", 0.4, 7, (0, 0.1, 0), "#263238", "Metal")])
add("Sci-Fi", "Control Panel", "Computer console", [P("Desk", (6, 3, 2), (0, 1.5, 0), "#37474f", "Metal"), P("Screen", (5, 2.4, 0.2), (0, 4.4, 0.6), "#00e5ff", "Neon", rot=(-15, 0, 0))] + [P("Button", (0.4, 0.2, 0.4), (-2 + i, 3.1, -0.4), ["#ff1744", "#ffea00", "#00e676", "#2979ff", "#ff9100"][i], "Neon") for i in range(5)])
add("Sci-Fi", "Space Crate", "Sci-fi cargo box", [P("Crate", (3.2, 3.2, 3.2), (0, 1.6, 0), "#455a64", "DiamondPlate"), P("Stripe", (3.3, 0.4, 3.3), (0, 1.6, 0), "#ffab00", "Neon")])
add("Sci-Fi", "Robot Statue", "Friendly blocky robot", [P("Legs", (2, 3, 1.4), (0, 1.5, 0), "#78909c", "Metal"), P("Body", (3.4, 3, 2), (0, 4.5, 0), "#b0bec5", "Metal"), P("Head", (2.2, 1.8, 1.8), (0, 7, 0), "#cfd8dc", "Metal"),
    P("Eye", (0.5, 0.4, 0.2), (-0.5, 7.1, -0.95), "#00e5ff", "Neon"), P("Eye", (0.5, 0.4, 0.2), (0.5, 7.1, -0.95), "#00e5ff", "Neon"), P("Arm", (0.8, 2.8, 0.8), (-2.2, 4.4, 0), "#90a4ae", "Metal"), P("Arm", (0.8, 2.8, 0.8), (2.2, 4.4, 0), "#90a4ae", "Metal"), VC("Antenna", 1.2, 0.2, (0, 8.5, 0), "#ff1744", "Neon")])

# SPOOKY
for i, (tname, sz) in enumerate([("Tombstone", (3, 4, 0.8)), ("Cross Grave", (0.8, 4, 0.8)), ("Big Tombstone", (4, 5.5, 1.2))]):
    parts = [P("Stone", sz, (0, sz[1] / 2, 0), "#90959c", "Slate", rot=(0, 0, (-1) ** i * 4)), P("Dirt", (sz[0] + 1, 0.3, 5), (0, 0.15, -2.8), "#5d4037", "Pebble")]
    if tname == "Cross Grave":
        parts.append(P("Arm", (2.6, 0.8, 0.8), (0, 2.8, 0), "#90959c", "Slate"))
    add("Spooky", tname, "Graveyard decoration", parts)
add("Spooky", "Pumpkin", "Jack-o'-lantern", [Ball("Pumpkin", 3, (0, 1.5, 0), "#ff8f00", light="#ffb74d"), VC("Stem", 0.8, 0.4, (0, 3.2, 0), "#558b2f"),
    P("Eye", (0.5, 0.5, 0.3), (-0.55, 1.9, -1.35), "#1a1a1a"), P("Eye", (0.5, 0.5, 0.3), (0.55, 1.9, -1.35), "#1a1a1a"), P("Mouth", (1.4, 0.35, 0.3), (0, 1.1, -1.4), "#1a1a1a")])
add("Spooky", "Coffin", "Creaky coffin", [P("Coffin", (2.6, 1.4, 6), (0, 0.7, 0), "#4e342e", "Wood"), P("Lid", (2.4, 0.2, 5.8), (0, 1.5, 0), "#3e2723", "Wood"), P("Cross", (0.3, 0.1, 1.6), (0, 1.65, -1), "#ffc107", "Foil"), P("CrossArm", (1, 0.1, 0.3), (0, 1.65, -1.3), "#ffc107", "Foil")])
add("Spooky", "Cauldron", "Bubbling witch pot", [VC("Pot", 2.6, 4, (0, 1.6, 0), "#212121", "Metal"), VC("Brew", 0.2, 3.6, (0, 2.95, 0), "#76ff03", "Neon", light="#76ff03"), P("Fire", (1, 0.4, 1), (0, 0.2, 0), "#ff6d00", "Neon", fire=True, cancollide=False)])
add("Spooky", "Skull", "Blocky skull", [P("Skull", (2, 2, 2), (0, 1.4, 0), "#f5f5f0"), P("Jaw", (1.6, 0.6, 1.6), (0, 0.3, -0.1), "#f5f5f0"), P("Eye", (0.5, 0.5, 0.2), (-0.45, 1.6, -1), "#111111"), P("Eye", (0.5, 0.5, 0.2), (0.45, 1.6, -1), "#111111")])
add("Spooky", "Iron Fence", "Graveyard fence", [P("Bar", (0.25, 5, 0.25), (-4.5 + i, 2.5, 0), "#263238", "Metal") for i in range(10)] + [P("Rail", (10, 0.3, 0.3), (0, y, 0), "#263238", "Metal") for y in (1, 4)])
add("Spooky", "Zombie Spawner", "Spawns zombies that chase players", [VC("Grave Hole", 0.4, 6, (0, 0.2, 0), "#33691e", "Neon", script="zombiespawner", light="#76ff03")])

# PETS (scripted followers)
def pet(name, color, extras, mat="SmoothPlastic"):
    parts = [Ball("Body", 2.2, (0, 2, 0), color, mat), Ball("Eye", 0.4, (-0.45, 2.3, -1), "#111111"), Ball("Eye", 0.4, (0.45, 2.3, -1), "#111111")]
    add("Pets", name, "Touch it and it follows you", parts + extras, script="pet")
pet("Kitty", "#ffb74d", [P("Ear", (0.5, 0.7, 0.2), (-0.6, 3.2, 0), "#ffb74d", rot=(0, 0, 20)), P("Ear", (0.5, 0.7, 0.2), (0.6, 3.2, 0), "#ffb74d", rot=(0, 0, -20))])
pet("Bunny", "#f5f5f5", [P("Ear", (0.4, 1.4, 0.2), (-0.4, 3.6, 0), "#f5f5f5"), P("Ear", (0.4, 1.4, 0.2), (0.4, 3.6, 0), "#f5f5f5"), Ball("Nose", 0.3, (0, 2, -1.1), "#ff80ab")])
pet("Puppy", "#a1887f", [P("Ear", (0.4, 1, 0.6), (-1.1, 2.4, 0), "#6d4c41"), P("Ear", (0.4, 1, 0.6), (1.1, 2.4, 0), "#6d4c41"), Ball("Nose", 0.4, (0, 1.9, -1.1), "#111111")])
pet("Dragon", "#43a047", [P("Wing", (1.8, 0.2, 1), (-1.5, 2.4, 0.3), "#2e7d32", rot=(0, 0, 25)), P("Wing", (1.8, 0.2, 1), (1.5, 2.4, 0.3), "#2e7d32", rot=(0, 0, -25)), P("Horn", (0.2, 0.6, 0.2), (-0.4, 3.2, 0), "#fff59d"), P("Horn", (0.2, 0.6, 0.2), (0.4, 3.2, 0), "#fff59d")])
pet("Unicorn", "#fce4ec", [P("Horn", (0.25, 1.2, 0.25), (0, 3.3, -0.4), "#ffd54f", rot=(-25, 0, 0)), P("Mane", (0.3, 0.8, 1.2), (0, 3, 0.3), "#ce93d8")])
pet("Robo Pup", "#90a4ae", [P("Antenna", (0.15, 0.9, 0.15), (0, 3.4, 0), "#ff1744", "Neon"), P("Visor", (1.4, 0.4, 0.2), (0, 2.3, -1.05), "#00e5ff", "Neon")], "Metal")
pet("Ghost Blob", "#e3f2fd", [P("Tail", (1, 0.8, 1), (0, 0.9, 0.3), "#e3f2fd", rot=(0, 45, 0))], "Glass")
pet("Golden Slime", "#ffd23f", [Ball("Shine", 0.5, (0.6, 2.8, -0.6), "#ffffff", "Neon")], "Foil")

# TOOLS (scripted, touch to pick up)
add("Tools", "Sword", "Click to swing, 25 damage", [P("Handle", (1, 0.8, 4), (0, 0.4, 0), "#b0e0ff", "Neon")], script="sword", kind="Tool")
add("Tools", "Speed Coil", "Hold to run fast", [P("Handle", (1, 1, 1.6), (0, 0.5, 0), "#2979ff", "Neon", "cyl")], script="speedcoil", kind="Tool")
add("Tools", "Gravity Coil", "Hold to float", [P("Handle", (1, 1, 1.6), (0, 0.5, 0), "#b388ff", "Neon", "cyl")], script="gravitycoil", kind="Tool")
add("Tools", "Healing Potion", "Click to drink", [P("Handle", (0.9, 1.4, 0.9), (0, 0.7, 0), "#ff4081", "Glass")], script="potion", kind="Tool")
add("Tools", "Flashlight", "Click for light", [P("Handle", (0.6, 0.6, 2), (0, 0.3, 0), "#424242", "Metal")], script="flashlight", kind="Tool")

# CHARACTERS + TYCOON
add("Game Systems", "Talking NPC", "Press E to talk; edit the lines", [P("NPC Stand", (4, 0.4, 4), (0, 0.2, 0), "#cfd8dc", "Marble", script="npc")])
add("Game Systems", "Mini Tycoon Kit", "Claim it and earn Cash", [
    P("ClaimPad", (5, 1, 5), (-9, 0.5, -6), "#40ff80", "Neon"),
    P("Conveyor", (4, 1, 20), (0, 1.5, 0), "#212121", "DiamondPlate", rot=(0, 180, 0)),
    P("Rail", (0.4, 1.4, 20), (2.2, 2.6, 0), "#ffd23f"), P("Rail", (0.4, 1.4, 20), (-2.2, 2.6, 0), "#ffd23f"),
    P("Dropper", (3, 3, 3), (0, 8, -8), "#ffffff", "Metal"),
    P("Collector", (5, 3, 3), (0, 2.5, 11.5), "#40ff80", "Neon")], script="tycoonkit")
add("Game Systems", "Speed Shop Pad", "Buy speed with Coins", [P("Shop Pad", (6, 1, 6), (0, 0.5, 0), "#ff4081", "Neon", script="shoppad")])

# ---------- writers ----------
ref_counter = [0]
def ref():
    ref_counter[0] += 1
    return f"RBX{ref_counter[0]:06d}"

def f(v):
    return f"{v:.4f}".rstrip("0").rstrip(".") if isinstance(v, float) else str(v)

def cframe_xml(pos, rot):
    R = rot_matrix(*rot)
    x, y, z = pos
    cells = "".join(f"<R{i}{j}>{f(round(R[i][j], 6))}</R{i}{j}>" for i in range(3) for j in range(3))
    return f'<CoordinateFrame name="CFrame"><X>{f(x)}</X><Y>{f(y)}</Y><Z>{f(z)}</Z>{cells}</CoordinateFrame>'

def script_xml(name, key):
    return (f'<Item class="Script" referent="{ref()}"><Properties><string name="Name">{escape(name)}</string>'
            f'<bool name="Disabled">false</bool><ProtectedString name="Source"><![CDATA[{S[key]}]]></ProtectedString></Properties></Item>')

def part_xml(p, offset, anchored=True):
    cls = p.get("cls", "Part")
    x, y, z = (p["pos"][i] + offset[i] for i in range(3))
    r, g, b = hexrgb(p["color"])
    color = 0xFF000000 | (r << 16) | (g << 8) | b
    props = [f'<string name="Name">{escape(p["name"])}</string>',
             f'<bool name="Anchored">{"true" if anchored else "false"}</bool>',
             cframe_xml((x, y, z), p["rot"]),
             f'<Vector3 name="size"><X>{f(p["size"][0])}</X><Y>{f(p["size"][1])}</Y><Z>{f(p["size"][2])}</Z></Vector3>',
             f'<Color3uint8 name="Color3uint8">{color}</Color3uint8>',
             f'<token name="Material">{MATERIAL[p["mat"]]}</token>',
             f'<bool name="CanCollide">{"false" if p.get("cancollide") is False else "true"}</bool>',
             f'<float name="Transparency">{f(float(p.get("transparency", 0)))}</float>',
             '<token name="TopSurface">0</token><token name="BottomSurface">0</token>']
    if cls == "Part":
        props.append(f'<token name="shape">{SHAPE[p["shape"]]}</token>')
    kids = ""
    if p.get("light"):
        lr, lg, lb = (c / 255 for c in hexrgb(p["light"]))
        kids += (f'<Item class="PointLight" referent="{ref()}"><Properties><string name="Name">Glow</string>'
                 f'<Color3 name="Color"><R>{f(round(lr, 4))}</R><G>{f(round(lg, 4))}</G><B>{f(round(lb, 4))}</B></Color3>'
                 f'<float name="Brightness">2</float><float name="Range">16</float></Properties></Item>')
    if p.get("fire"):
        kids += f'<Item class="Fire" referent="{ref()}"><Properties><string name="Name">Fire</string></Properties></Item>'
    if p.get("sparkles"):
        kids += f'<Item class="Sparkles" referent="{ref()}"><Properties><string name="Name">Sparkles</string></Properties></Item>'
    if p.get("script"):
        kids += script_xml("Script", p["script"])
    return f'<Item class="{cls}" referent="{ref()}"><Properties>{"".join(props)}</Properties>{kids}</Item>'

def bounds(parts):
    lo, hi = [1e9] * 3, [-1e9] * 3
    for p in parts:
        ext = max(p["size"]) / 2 if p["rot"] != (0, 0, 0) or p["shape"] != "block" else None
        for i in range(3):
            e = ext if ext is not None else p["size"][i] / 2
            lo[i] = min(lo[i], p["pos"][i] - e)
            hi[i] = max(hi[i], p["pos"][i] + e)
    return lo, hi

def model_xml(m, offset):
    is_tool = m["kind"] == "Tool"
    inner = "".join(part_xml(p, offset, anchored=not is_tool) for p in m["parts"])
    if m["script"]:
        inner += script_xml("Script", m["script"])
    cls = "Tool" if is_tool else "Model"
    return f'<Item class="{cls}" referent="{ref()}"><Properties><string name="Name">{escape(m["name"])}</string></Properties>{inner}</Item>'

def write_pack(pack, models):
    items, x = [], 0.0
    for m in models:
        lo, hi = bounds(m["parts"])
        width = hi[0] - lo[0]
        offset = (x - lo[0], 0, 0)
        if m["kind"] == "Tool":
            offset = (x - lo[0], 1, 0)
        items.append(model_xml(m, offset))
        x += width + 6
    body = (f'<Item class="Folder" referent="{ref()}"><Properties><string name="Name">Creator Vault - {escape(pack)}</string></Properties>'
            + "".join(items) + "</Item>")
    xml = ('<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
           'xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">' + body + "</roblox>")
    path = os.path.join(OUT, f"Creator Vault - {pack}.rbxmx")
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(xml)
    return path


# ---------- Luau builders (so Claude can add any model through the Studio connector) ----------
ENUM_SHAPE = {"ball": "Ball", "block": "Block", "cyl": "Cylinder"}

def lnum(v):
    v = round(v, 4)
    return str(int(v)) if v == int(v) else repr(v)

def luau_builder(m):
    is_tool = m["kind"] == "Tool"
    L = ["-- Creator Vault: " + m["name"],
         "local base = CFrame.new(0, %s, -20)" % ("3" if is_tool else "0"),
         'local model = Instance.new("%s")' % ("Tool" if is_tool else "Model"),
         'model.Name = "%s"' % m["name"],
         "local function add(class, name, size, cf, rgb, material, extra)",
         "\tlocal p = Instance.new(class)",
         "\tp.Name = name",
         "\tp.Anchored = %s" % ("false" if is_tool else "true"),
         "\tp.Size = size",
         "\tp.CFrame = base * cf",
         "\tp.Color = Color3.fromRGB(rgb[1], rgb[2], rgb[3])",
         "\tp.Material = Enum.Material[material]",
         "\tp.TopSurface = Enum.SurfaceType.Smooth",
         "\tp.BottomSurface = Enum.SurfaceType.Smooth",
         "\tfor k, v in pairs(extra or {}) do p[k] = v end",
         "\tp.Parent = model",
         "\treturn p",
         "end",
         "local function addScript(parent, source)",
         '\tlocal s = Instance.new("Script")',
         "\ts.Source = source",
         "\ts.Parent = parent",
         "end"]
    for i, p in enumerate(m["parts"]):
        R = rot_matrix(*p["rot"])
        x, y, z = p["pos"]
        if p["rot"] == (0, 0, 0):
            cf = "CFrame.new(%s, %s, %s)" % (lnum(x), lnum(y), lnum(z))
        else:
            cf = "CFrame.new(%s)" % ", ".join(lnum(v) for v in [x, y, z] + [R[a][b] for a in range(3) for b in range(3)])
        r, g, b = hexrgb(p["color"])
        extra = []
        if p.get("cls", "Part") == "Part" and p["shape"] != "block":
            extra.append("Shape = Enum.PartType.%s" % ENUM_SHAPE[p["shape"]])
        if p.get("cancollide") is False:
            extra.append("CanCollide = false")
        if p.get("transparency"):
            extra.append("Transparency = %s" % lnum(float(p["transparency"])))
        line = 'local p%d = add("%s", "%s", Vector3.new(%s), %s, {%d, %d, %d}, "%s"%s)' % (
            i, p.get("cls", "Part"), p["name"], ", ".join(lnum(v) for v in p["size"]), cf, r, g, b, p["mat"],
            (", {" + ", ".join(extra) + "}") if extra else "")
        L.append(line)
        if p.get("light"):
            lr, lg, lb = hexrgb(p["light"])
            L.append('do local l = Instance.new("PointLight") l.Color = Color3.fromRGB(%d, %d, %d) l.Brightness = 2 l.Range = 16 l.Parent = p%d end' % (lr, lg, lb, i))
        if p.get("fire"):
            L.append('Instance.new("Fire").Parent = p%d' % i)
        if p.get("sparkles"):
            L.append('Instance.new("Sparkles").Parent = p%d' % i)
        if p.get("script"):
            src = S[p["script"]]
            assert "]==]" not in src
            L.append("addScript(p%d, [==[\n%s]==])" % (i, src))
    if m["script"]:
        assert "]==]" not in S[m["script"]]
        L.append("addScript(model, [==[\n%s]==])" % S[m["script"]])
    L.append("model.Parent = workspace")
    L.append('game:GetService("Selection"):Set({ model })')
    return "\n".join(L) + "\n"

def catalog_json():
    out = []
    for m in CATALOG:
        parts = []
        for p in m["parts"]:
            R = rot_matrix(*p["rot"])
            parts.append(dict(s=p["shape"], z=[round(v, 3) for v in p["size"]], p=[round(v, 3) for v in p["pos"]],
                              r=[round(R[i][j], 5) for i in range(3) for j in range(3)], c=p["color"],
                              g=1 if (p["mat"] == "Neon" or p.get("light")) else 0,
                              t=round(float(p.get("transparency", 0)) if p["mat"] != "Glass" else max(0.25, float(p.get("transparency", 0))), 2),
                              h=1 if p.get("transparency", 0) >= 1 else 0, cls=p.get("cls", "Part")))
        out.append(dict(pack=m["pack"], name=m["name"], desc=m["desc"], scripted=bool(m["script"] or any(p.get("script") for p in m["parts"])),
                        tool=m["kind"] == "Tool", parts=parts, lua=luau_builder(m)))
    return out

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    packs = {}
    for m in CATALOG:
        packs.setdefault(m["pack"], []).append(m)
    for pack, models in packs.items():
        print(f"{pack:13s} {len(models):3d} models -> {os.path.basename(write_pack(pack, models))}")
    print("TOTAL", len(CATALOG), "models,", sum(1 for m in CATALOG if m["script"] or any(p.get("script") for p in m["parts"])), "scripted")
    here = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(here, "vault_catalog.json"), "w") as fh:
        json.dump(catalog_json(), fh, separators=(",", ":"))
    bd = os.path.join(here, "vault_builders")
    os.makedirs(bd, exist_ok=True)
    for m in CATALOG:
        with open(os.path.join(bd, m["name"].replace(" ", "_") + ".luau"), "w") as fh:
            fh.write(luau_builder(m))
    sd = os.path.join(here, "vault_scripts")
    os.makedirs(sd, exist_ok=True)
    for k, v in S.items():
        with open(os.path.join(sd, k + ".luau"), "w") as fh:
            fh.write(v)
