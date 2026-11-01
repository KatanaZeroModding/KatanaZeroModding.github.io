"""Build the no-JavaScript idle poster from the imported original sprite strips.

Optional asset-authoring dependency: Pillow. Not needed to build or serve the site.
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SPRITES = json.loads((ROOT / "src/lib/bar-sprites.json").read_text())
image = Image.new("RGBA", (1280, 500), "#101014")
placements = [
    ("bg_bar", 0, 0, 1, False),
    ("spr_player_sitstool_idle", 291, 243, 1, False),
    ("spr_bartender_idle", 326, 228, 1, False),
    ("spr_vet1_shirt_right_idle", 376, 243, 1, False),
    ("spr_vet2_cap_idle", 398, 243, 1, False),
    ("spr_bar_glass", 304, 221, 1, False),
]
for name, x, y, scale, mirror in placements:
    meta = SPRITES[name]
    sprite = Image.open(ROOT / "static" / meta["src"].lstrip("/")).convert("RGBA")
    sprite = sprite.crop((0, 0, meta["width"], meta["height"]))
    if mirror:
        sprite = sprite.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    size = (round(meta["width"] * scale * 2), round(meta["height"] * scale * 2))
    sprite = sprite.resize(size, Image.Resampling.NEAREST)
    origin_x = meta["width"] - meta["originX"] if mirror else meta["originX"]
    left = round((x - origin_x * scale) * 2)
    top = round((y - meta["originY"] * scale - 38) * 2)
    image.alpha_composite(sprite, (left, top))
image.convert("RGB").save(ROOT / "static/bar/poster.png", optimize=True)
print("Rendered static/bar/poster.png")
