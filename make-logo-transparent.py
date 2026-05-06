"""
Rend le fond blanc/clair des logos reellement transparent.
Sauvegarde directement dans images/optimized/.
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from PIL import Image
from pathlib import Path

SRC = Path(__file__).parent / "images"
DST = SRC / "optimized"
DST.mkdir(exist_ok=True)

# Seuil: pixels avec R+G+B > THRESHOLD * 3 = consideres comme fond blanc
# 215 sur 255 = pixels assez clairs (blanc, beige clair, gris clair)
WHITE_THRESHOLD = 215
TARGET_WIDTH = 600

def remove_white_bg(src_path: Path, output_name: str):
    img = Image.open(src_path).convert("RGBA")

    # Resize pour le web
    if img.width > TARGET_WIDTH:
        ratio = TARGET_WIDTH / img.width
        new_h = int(img.height * ratio)
        img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)

    pixels = img.load()
    w, h = img.size
    transparent_count = 0

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # Si le pixel est presque blanc/tres clair, on le rend transparent
            brightness = (r + g + b) / 3
            if brightness > WHITE_THRESHOLD:
                # Transition douce: plus le pixel est clair, plus il est transparent
                if brightness > 245:
                    pixels[x, y] = (r, g, b, 0)  # 100% transparent
                    transparent_count += 1
                else:
                    # Bordure: alpha proportionnel
                    alpha = int(255 * (245 - brightness) / (245 - WHITE_THRESHOLD))
                    pixels[x, y] = (r, g, b, alpha)

    out_path = DST / output_name
    img.save(out_path, "PNG", optimize=True)
    print(f"  {src_path.name} -> {output_name} ({transparent_count} px transparents, {out_path.stat().st_size//1024} KB)")
    return img

if __name__ == "__main__":
    print("Conversion fond blanc -> transparent...\n")
    remove_white_bg(SRC / "logo kintsugi transparant.png", "logo-clean.png")
    print("\nFini. Utiliser 'images/optimized/logo-clean.png' dans le HTML.")
