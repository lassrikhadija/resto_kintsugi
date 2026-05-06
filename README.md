# 🍣 Restaurant Kintsugi — Démo Nextiweb

Site vitrine pour un restaurant japonais haut de gamme fictif à Montréal.
Premier projet du portfolio **Nextiweb.ca** (agence web canadienne).

🌐 **Démo** : déployé sur Hostinger
🎨 **Concept** : "L'art du sushi, sublimé" — esthétique noir & or inspirée du *kintsugi* (art japonais de réparer la céramique avec de l'or)

---

## ✨ Fonctionnalités

- **Bilingue FR / EN** avec balises `hreflang` (SEO multilingue propre)
- **One-page responsive** (desktop, tablette, mobile)
- **10 sections** : Hero · Histoire · Menu · Équipe · Ambiance · Avis · FAQ · Réservation · Contact · Footer
- **Menu interactif** avec 3 onglets et 12 plats
- **Formulaire de réservation** (démo, validation HTML5 + JS)
- **FAQ accordéon** avec Schema.org `FAQPage`
- **Galerie photo** en mosaïque
- **Newsletter** dans le footer
- **Badge "Démo Nextiweb"** flottant pointant vers nextiweb.ca

## 🚀 SEO & Performance

- ✅ **Schema.org `Restaurant`** + `FAQPage` complet (rich snippets Google)
- ✅ **Open Graph** + **Twitter Cards** dans les 2 langues
- ✅ `sitemap.xml` + `robots.txt`
- ✅ Balises `hreflang` croisées (fr-CA ↔ en-CA)
- ✅ Images optimisées en **WebP** (avec fallback JPG via `<picture>`) — 166 Mo → 1,3 Mo (-99%)
- ✅ Lazy loading + `width`/`height` sur toutes les images (zéro CLS)
- ✅ Preload du hero + DNS prefetch
- ✅ Accessibilité : skip-link, ARIA, focus visible, `prefers-reduced-motion`

## 📁 Structure

```
restaurant_kintsugi/
├── index.html                      # Version FR (langue par défaut)
├── index-en.html                   # Version EN
├── robots.txt
├── sitemap.xml
├── css/style.css                   # Charte noir + or
├── js/script.js                    # Interactions + i18n
├── images/
│   └── optimized/                  # WebP + JPG (versionnés)
├── optimize-images.py              # Script de compression PNG → WebP/JPG
└── make-logo-transparent.py        # Script de transparence du logo
```

> Les fichiers **PNG originaux** (~166 Mo) ne sont **pas versionnés** (voir `.gitignore`).
> Les versions optimisées dans `images/optimized/` sont suffisantes pour faire tourner le site.

## 🛠️ Stack

- HTML5 sémantique
- CSS pur (variables CSS, grid, flexbox) — **pas de framework**
- JavaScript vanilla — **pas de dépendance**
- Polices Google : Cormorant Garamond + Inter + Noto Serif JP

## 🧰 Re-générer les images optimisées (optionnel)

Si vous avez les originaux PNG en local dans `images/` :

```bash
pip install Pillow
python optimize-images.py
python make-logo-transparent.py
```

## 📦 Déploiement Hostinger

1. Uploader tout le dossier (sauf `*.py` et `images/*.png`) à la racine du domaine
2. Vérifier que le `.htaccess` Hostinger sert `index.html` par défaut
3. Pour la version EN, accessible via `/index-en.html`
4. Mettre à jour les URLs dans `index.html`, `index-en.html`, `sitemap.xml` et le Schema.org JSON-LD si le domaine final diffère de `kintsugi-sushi.ca`

## 📄 Licence

Site démo créé à des fins de portfolio. Tous droits réservés à **Nextiweb.ca**.

---

🤖 *Conçu avec [Nextiweb.ca](https://nextiweb.ca) — Création de sites web sur mesure au Canada.*
