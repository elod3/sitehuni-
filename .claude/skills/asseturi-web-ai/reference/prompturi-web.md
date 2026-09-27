# Prompturi pentru asset-uri web

La finalul fiecărui prompt lipești blocul `STYLE:` al site-ului (vezi SKILL.md, secțiunea 1).

## Cuprins
- Hero imagine
- Hero video în buclă
- Fundaluri și texturi
- Set de carduri
- Iconițe și ilustrații
- Open Graph
- Produse e-shop
- Model 3D

## Hero imagine

Imobiliare (editare pe randare, `gpt_image_2_5 --image randare.png`):
```
Extend the canvas to a 21:9 wide banner: add more sky and lawn on the left side,
matching the existing light and perspective. Change only the canvas size.
Keep the building exactly as in the image. Leave a calm empty sky area on the left third for a headline.
```

Brutărie (`gpt_image_2_5`, 16:9, cu poza reală ca referință):
```
Wide banner of a rustic bakery counter at early morning, the loaves from the reference on a wooden board on the right third,
warm window light from the right, soft steam, flour dust in the light. Dark warm background fading to calm shadow on the left
for a headline. Commercial food photograph, 50mm, moderate depth of field.
Keep the bread exactly as in the reference.
```

Magazin muzică (`soul_location` sau `gpt_image_2_5`, 21:9):
```
Wide interior of a cozy independent music shop at evening, a wall of generic unbranded electric and acoustic guitars on the right,
warm amber practical lamps, light haze, deep teal shadows on the left side for a headline.
Editorial interior photograph, 24mm, no logos, no text.
```

## Hero video în buclă

`seedance_2_5 --mode omni_reference --start-image hero.png --end-image hero.png`, 8 s, 16:9:
```
Locked-off camera. Only ambient motion: tree leaves sway gently, soft clouds drift slowly,
warm window lights glow steadily. The scene ends exactly as it starts for a seamless loop.
Keep the architecture exactly as in the image. Real-time speed.
```
Variantă cu mișcare minimă:
```
Very slow lateral camera drift to the right and back to the starting position, seamless loop.
Keep everything in the image unchanged. Stable geometry.
```

## Fundaluri și texturi

```
Seamless subtle texture of warm white lime plaster, soft side light revealing fine surface variation,
very low contrast, no objects, suitable as a website section background. 16:9.
```
Alte materiale bune: `light oak wood grain`, `terrazzo with small grey and ochre chips`, `raw linen fabric`, `kraft paper`, `brushed anthracite metal`.
Dacă textura trebuie să se repete (tile), cere `seamless tileable texture` și verifică marginile. Altfel folosește o imagine mare cu `background-size: cover`.

## Set de carduri (3–6, identice ca stil)

Prima imagine se generează normal. Restul primesc prima ca `--image` de stil:
```
Same lighting, camera angle, background and color grade as the reference image.
New subject: [croissant with almonds] centered on the same marble surface.
```
Schimbi **doar** subiectul. Totul rămâne identic, ca cardurile să arate ca un set.

## Iconițe și ilustrații

`recraft_v4_1 --model_type vector`:
```
Set-consistent line icon of [a house with a garden tree], thin 1.5px strokes, rounded caps and joins,
single color #2B2B2B, no fill, no background, centered on a square canvas, minimal, geometric.
```
Pentru un set: generezi iconițele una câte una cu **aceeași** frază de stil și schimbi doar `[obiectul]`.
Curățare SVG: `npx svgo icon.svg`, apoi înlocuiești culoarea fixă cu `currentColor`.

Ilustrație pentru stări goale sau 404:
```
Minimal flat illustration of [an empty bread basket], two colors (#2B2B2B and #C9A66B), lots of white space,
simple shapes, friendly, no text.
```

## Open Graph (1200×630)

`gpt_image_2_5`, aspect 1.91:1 (sau 16:9 și crop la 1200×630):
```
Website share image. Background: [hero-ul site-ului, blurat ușor și întunecat].
Headline text "Arcadian Residence" in a bold condensed sans-serif, cream color, centered,
smaller line below: "Case cu grădină la 15 min de Târgu Mureș". Exact spelling, keep Romanian diacritics.
Large readable text, high contrast, no other text.
```
Verifici diacriticele. Dacă ies greșit, pui textul în Figma sau Canva peste imagine.

## Produse e-shop

Skill-ul oficial `higgsfield-product-photoshoot`, mod `product_shot`, cu poza reală (`--image`), `--count 1` per produs.
Prompt scurt, identic pentru toate produsele: `clean catalog shot on a warm light-grey seamless background, soft shadow below, front three-quarter view, consistent with the rest of the catalog`.

## Model 3D

`multi_image_to_3d --image fata.png --image lateral.png --image spate.png --should_texture true`.
Afișare:
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@google/model-viewer/dist/model-viewer.min.js"></script>
<model-viewer src="assets/3d/produs.glb" poster="assets/3d/produs-poster.webp" alt="…"
  camera-controls auto-rotate shadow-intensity="1" loading="lazy" style="width:100%;aspect-ratio:1"></model-viewer>
```
Comprimă GLB-ul: `npx @gltf-transform/cli optimize produs.glb produs-opt.glb --texture-compress webp`.
Pentru o casă întreagă, modelul arhitectului (SketchUp/Revit → glTF) e mult mai precis decât un 3D generat din poze.
