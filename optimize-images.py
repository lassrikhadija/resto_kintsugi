"""
Optimise les images du site Kintsugi pour le web.
Cree des versions WebP (modernes, ~80% plus legeres) + fallback JPG dans images/optimized/.
Originaux preserves.
Usage: python optimize-images.py
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from PIL import Image
from pathlib import Path

SRC = Path(__file__).parent / "images"
DST = SRC / "optimized"
DST.mkdir(exist_ok=True)

# Largeur cible par usage (en pixels). Hauteur calculée auto pour conserver l'aspect.
TARGETS = {
    "image h1":                 1920,  # hero — plein écran desktop
    "image s1":                 1100,  # split histoire
    "image m1":                 800,   # vignette plat
    "image m2":                 800,
    "image m3":                 800,
    "image m4":                 800,
    "image m5":                 800,
    "image m6":                 800,
    "plat1":                    800,
    "plat2":                    800,
    "plat3":                    800,
    "plat4":                    800,
    "plat5":                    800,
    "image a1":                 1600,  # gallery — image principale
    "image a2":                 900,
    "image a5":                 900,
    "image kintsugi":           900,
    "photo equipe":             1100,
    "photo equipe2":            1100,
    "logo kintsugi":            400,   # logo header
    "logo kintsugi transparant":400,
}

WEBP_QUALITY = 82
JPG_QUALITY  = 85

def optimize(src_path: Path, target_width: int):
    img = Image.open(src_path)
    if img.mode in ("RGBA", "LA"):
        is_transparent = True
    else:
        is_transparent = False
        img = img.convert("RGB")

    # Resize seulement si plus grande que la cible
    if img.width > target_width:
        ratio = target_width / img.width
        new_h = int(img.height * ratio)
        img = img.resize((target_width, new_h), Image.LANCZOS)

    stem = src_path.stem
    # WebP
    webp_path = DST / f"{stem}.webp"
    img.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
    # JPG fallback (sauf logo transparent)
    if not (is_transparent and "transparant" in stem):
        jpg_path = DST / f"{stem}.jpg"
        rgb = img.convert("RGB") if is_transparent else img
        rgb.save(jpg_path, "JPEG", quality=JPG_QUALITY, optimize=True, progressive=True)
    # Logo transparent : aussi en PNG optimisé
    if is_transparent and "transparant" in stem:
        png_path = DST / f"{stem}.png"
        img.save(png_path, "PNG", optimize=True)

    src_size = src_path.stat().st_size / 1024
    new_size = webp_path.stat().st_size / 1024
    print(f"  {src_path.name:40s} {src_size:7.0f} KB -> {new_size:6.0f} KB  ({100*(1-new_size/src_size):.0f}% gain)")

def main():
    print(f"Optimisation des images vers: {DST}\n")
    total_src = 0
    total_dst = 0
    for src in sorted(SRC.glob("*.png")):
        if src.parent.name == "optimized":
            continue
        stem = src.stem
        target = TARGETS.get(stem, 1200)  # fallback 1200px
        try:
            optimize(src, target)
            total_src += src.stat().st_size
            # Compter le webp comme principal
            webp = DST / f"{stem}.webp"
            if webp.exists():
                total_dst += webp.stat().st_size
        except Exception as e:
            print(f"  ! Erreur sur {src.name}: {e}")

    print(f"\nTotal original : {total_src/1024/1024:6.1f} MB")
    print(f"Total optimisé : {total_dst/1024/1024:6.1f} MB")
    print(f"Gain global    : {100*(1-total_dst/total_src):.0f}%")

if __name__ == "__main__":
    main()
