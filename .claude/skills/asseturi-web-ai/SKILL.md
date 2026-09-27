---
name: asseturi-web-ai
description: Generează și pregătește asset-uri pentru site-uri cu AI (Higgsfield): imagini hero, video de fundal în buclă, fundaluri și texturi de secțiune, ilustrații și iconițe într-un stil unitar, imagini Open Graph, favicon, poze de produs pentru e-shop, modele 3D GLB. Include prompturile, formatele și dimensiunile, optimizarea (WebP, srcset, MP4 + WebM, poster), HTML-ul corect pentru performanță (LCP, CLS) și un script care le face automat. Se folosește la construirea sau refacerea unui site de client, când trebuie imagini sau video pentru web.
---

# Asset-uri web cu AI

Pentru prompturi folosește și `prompturi-imagini-ai`, `prompturi-video-ai` și `realism-si-lumina`. Aici e partea specifică web-ului: **ce** asset-uri îți trebuie, **cum** le generezi ca să arate unitar și **cum** le pui în pagină fără să strici viteza.

## Regula de bază

Un site arată profesionist când asset-urile arată **ca dintr-o singură ședință foto**: aceeași lumină, aceeași paletă, aceeași lentilă. Asta se decide **înainte** de prima generare, într-un „style lock”.

## 1. Style lock (o dată per site)

Scrie un bloc de stil și lipește-l **identic** la finalul fiecărui prompt pentru acel site:

```
STYLE: warm natural daylight from the left, soft shadows, muted earthy palette
(cream #F4EFE6, anthracite #2B2B2B, oak brown, sage green accents),
shot on 35mm, moderate depth of field, subtle film grain, calm and minimal composition,
generous negative space.
```

- Culorile vin din design-ul site-ului (variabilele CSS din `:root`). Pentru Arcadian: alb cald, antracit, stejar, terrazzo, verde doar ca accent.
- Generezi 1–2 imagini, alegi cea mai bună și o folosești ca **referință de stil** (`--image`) pentru restul.
- Iconițe și ilustrații: un singur model (`recraft_v4_1 --model_type vector`) și o singură descriere de stil (`thin 1.5px line icons, rounded caps, single color #2B2B2B, no fill`).

## 2. Ce asset-uri îi trebuie unui site

| Asset | Format | Model / metodă | Note |
|---|---|---|---|
| Hero imagine | 16:9 sau 21:9, sursă ≥ 2400 px | `gpt_image_2_5` / `soul_location` / randarea reală | spațiu gol unde vine titlul; subiectul pe o parte |
| Hero video | 16:9, 6–10 s, buclă | `seedance_2_5` din imaginea hero | mișcare lentă, fără tăieturi; vezi „Bucle” |
| Hero mobil | 9:16 sau 4:5 | re-crop sau generare separată | nu te baza pe crop automat din 21:9 |
| Fundal de secțiune / textură | 16:9, subtil | `gpt_image_2_5` | contrast mic, ca textul să rămână lizibil |
| Carduri, categorii | 4:3 sau 1:1, set de 3–6 | aceeași referință de stil | același unghi și aceeași lumină la toate |
| Produse e-shop | 1:1 sau 4:5, fundal uniform | skill-ul `higgsfield-product-photoshoot`, mod `product_shot`, cu poza reală | toate pe același fundal și cu aceeași umbră |
| Iconițe | SVG | `recraft_v4_1 --model_type vector` | curăță SVG-ul; o singură culoare, ca să poți folosi `currentColor` |
| Ilustrații | SVG sau WebP | `recraft_v4_1` / `nano_banana_flash` | un stil pentru tot site-ul |
| Open Graph (preview pe Facebook/WhatsApp) | 1200×630 | `gpt_image_2_5` cu titlul pe imagine | text mare, sub 6 cuvinte, centrat |
| Favicon | SVG + PNG 32/180/512 | din logo, nu generat de la zero | un simbol simplu, lizibil la 16 px |
| Model 3D | GLB | `multi_image_to_3d` din 1–4 poze | afișat cu `<model-viewer>`; comprimă (sub ~5 MB) |
| 404 / stări goale | ilustrație | același stil de ilustrații | mic detaliu care face site-ul să pară „lucrat” |

**Prompturi gata de adaptat** pentru fiecare tip sunt în [reference/prompturi-web.md](reference/prompturi-web.md).

## 3. Compoziție pentru web (diferit față de social media)

- **Loc pentru text:** `subject on the right third, calm empty area on the left for a headline`. Titlul site-ului stă peste imagine.
- **Contrast controlat:** zona de sub text e liniștită (cer, perete, fundal blurat). Adaugi oricum un gradient CSS peste imagine pentru lizibilitate.
- **Crop sigur:** subiectul important în centrul de 60%, ca să supraviețuiască pe mobil (`object-fit: cover` taie marginile).
- **Fără text generat în imagini**, cu excepția OG. Textul e HTML (SEO, traducere, accesibilitate).
- **Nu înlocui realitatea clientului:** pentru imobiliare folosești randările, pentru e-shop pozele produselor reale. AI-ul face fundaluri, atmosferă și variante.

## 4. Bucle video fără cusătură

- Folosește **același cadru ca start și end** (`--start-image X --end-image X`) și o mișcare care se întoarce: `camera slowly drifts right and returns`. Sau o mișcare ambientală fără mișcare de cameră: `locked-off camera, only leaves, clouds and light move`.
- Mișcare lentă, uniformă, fără eveniment (o ușă care se deschide rupe bucla).
- 6–10 s. Mai lung = fișier mai mare, fără beneficiu.

## 5. Optimizare și integrare

Rulează scriptul. Face variantele și îți scrie tag-ul HTML:

```bash
S=~/.claude/skills/asseturi-web-ai/scripts/optimizeaza.sh
$S img   generat/hero.png  hero-fatada           # → assets/img/hero-fatada-900.webp, -1800.webp + <img>
$S img   generat/card.png  card-tip1 assets/img "600 1200"
$S video generat/hero.mp4 hero-bucla             # → assets/video/hero-bucla.mp4, .webm, -poster.webp + <video>
```

Numele urmează convenția din repo: `nume-900.webp` / `nume-1800.webp`.

**Ținte de mărime:**

| Asset | Țintă |
|---|---|
| Hero imagine 1800 px WebP | sub ~250 KB |
| Card 900 px | sub ~80 KB |
| Hero video (720p, 8 s) | sub ~1,5 MB MP4; WebM mai mic |
| Poster | sub ~150 KB |
| SVG iconiță | sub ~2 KB |

**Reguli HTML** (cum e deja făcut în acest site):
- `width` și `height` pe fiecare `<img>` și `<video>`, ca să nu sară layout-ul (CLS).
- Imaginea hero: **fără** `loading="lazy"`, cu `<link rel="preload" as="image">` (aici se face din `build.py`, cheia `preload`). Toate celelalte: `loading="lazy"`.
- Video de fundal: `autoplay muted loop playsinline preload="metadata"` + `poster`. Fără `muted` nu pornește; fără `playsinline` iOS îl deschide pe tot ecranul.
- Respectă `prefers-reduced-motion`: oprești video-ul și arăți posterul.
- `alt` descriptiv în română la imaginile cu conținut; `alt=""` la cele decorative.
- Pe mobil sau pe conexiuni lente poți servi doar posterul (media query sau JS), ca să economisești datele utilizatorului.

## 6. Checklist de livrare

```
- [ ] Style lock scris și folosit la toate asset-urile
- [ ] Culorile potrivite cu variabilele CSS ale site-ului
- [ ] Hero: loc pentru titlu, subiectul în zona sigură de crop, variantă pentru mobil
- [ ] Nicio imagine cu text generat (în afară de OG)
- [ ] Rulat optimizeaza.sh; mărimile în ținte
- [ ] width/height, lazy/preload, alt în română
- [ ] Video: muted playsinline poster + reduced-motion
- [ ] Asset-urile AI nu înlocuiesc produsul sau clădirea reală a clientului
```
