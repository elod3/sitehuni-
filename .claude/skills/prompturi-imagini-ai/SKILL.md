---
name: prompturi-imagini-ai
description: Scrie prompturi pentru generare și editare de imagini AI (GPT Image 2.5, Nano Banana, Soul 2.0, Soul Location, Seedream, Recraft pe Higgsfield). Acoperă fotografie de produs, food photography, interioare și arhitectură, afișe cu text, editări care păstrează identitatea, cadre de start pentru video și variante de reclame statice. Se folosește când trebuie creată sau reparată o imagine, un banner, o postare, un afiș sau un cadru cheie pentru o reclamă.
---

# Prompturi imagini AI

Prompturile se scriu **în engleză**. Textul care apare **în** imagine poate fi în română, pus între ghilimele.

## Ordinea care funcționează

Scena → subiect → detalii cheie → stil și fotografie → constrângeri → scopul (unde se folosește).

```
[Scenă / fundal]
[Subiect + material + stare]
[Detalii cheie, texturi]
[Fotografie: încadrare, lentilă, lumină, culoare]
[Text în imagine, dacă e: "TEXT" + font + poziție]
[Constrângeri: ce rămâne fix, ce lipsește]
[Scop: Instagram ad 4:5, hero banner website, menu board…]
```

Exemplu (brutărie):

```
Rustic bakery counter made of reclaimed oak, soft morning window light from the left.
A tray of golden butter croissants, flaky layers visible, a few crumbs on the wood, light dusting of powdered sugar.
Shot on 50mm, eye level, shallow depth of field, warm natural color grade, high detail, photorealistic.
Negative space in the upper third for a headline.
Instagram feed ad, 4:5.
```

Scrie ca un **brief creativ**, nu ca o listă de cuvinte cheie. `beautiful, amazing, 8k, masterpiece` nu ajută. Materialele concrete ajută: `reclaimed oak`, `standing-seam metal cladding`, `terrazzo`, `flaky laminated dough`, `sunburst lacquer finish`.

## Alegerea modelului (Higgsfield)

| Nevoie | Model |
|---|---|
| Default: design, bannere, **text în imagine**, editări | `gpt_image_2_5` |
| Fotografie de produs de brand (studio, lifestyle, pachete de reclame) | skill-ul oficial `higgsfield-product-photoshoot` (are prompt enhancer propriu, nu scrii tu promptul final) |
| Oameni originali, UGC, lifestyle editorial | `text2image_soul_v2` |
| Cadru cinematic | `soul_cinematic` |
| Locuri, peisaje, fără oameni | `soul_location` (doar prompt, fără referințe) |
| Aceeași față din poze reale, fișă de personaj | `seedream_v5_pro` |
| Logo, iconițe, vector | `recraft_v4_1 --model_type vector` |
| Personaje cartoon | `nano_banana_flash` |
| Drafturi rapide și ieftine | `z_image` sau `nano_banana_2_lite` |

Verifici parametrii cu `higgsfield model get <id>`.

## Text în imagine

- Textul exact între ghilimele: `headline text "PÂINE CALDĂ LA 7:00"`.
- Descrii tipografia: `bold condensed sans-serif, cream color, top center`.
- Cuvintele grele sau cu diacritice: cere `verbatim, exact spelling, keep Romanian diacritics ă â î ș ț`. Dacă tot greșește, **pui textul în Canva sau Figma**, nu te lupți cu modelul.
- Maxim un titlu și o linie scurtă. Paragrafele ies stricate.
- Pentru reclame Meta: textul pe imagine scurt (sub ~20% din suprafață); restul intră în textul reclamei.

## Editare (cu imagine de referință)

Regula oficială OpenAI, valabilă la toate modelele: **„change only X, keep everything else the same”**, iar lista de păstrat o repeți la fiecare iterație ca să nu apară deriva.

```
Change only the sky to a warm sunset with soft pink clouds.
Keep the building, windows, materials, trees, bench and camera angle exactly the same.
Do not alter colors or contrast of the facade.
```

- O singură modificare pe iterație. Mai multe modificări deodată = greu de controlat.
- Nu redescrie ce e deja în imagine. Descrii **schimbarea**.

## Fotorealism

- `photorealistic`, `shot on [lentilă]`, lumină cu direcție (`window light from the left`).
- Texturi reale și mici imperfecțiuni: `crumbs`, `fingerprints on glass`, `fabric wrinkles`, `visible pores`.
- Evită `perfect`, `flawless`, `studio polish` când vrei natural. Arată fals.
- Oameni: acțiuni simple și naturale, surprinse „candid”.

## Cadre de start pentru video

Când imaginea va fi animată:
- Lasă **spațiu** în direcția în care se va mișca camera.
- Lumină și paletă identice între cadrul de start și cel de final.
- Fără text în cadru. Textul se pune în montaj.
- Rezoluție mare (2k), aspect ratio identic cu cel al video-ului.

## Variante de reclamă

Pentru teste A/B generezi 3–5 variante care diferă **într-o singură dimensiune** (fundal, unghi sau paletă), ca să afli ce funcționează. Nu faci 5 imagini complet diferite.

Vocabularul de fotografie pe nișe (mâncare, arhitectură, instrumente) e în [reference/vocabular-foto.md](reference/vocabular-foto.md).

## Checklist

```
- [ ] Ordinea: scenă → subiect → detalii → fotografie → text → constrângeri → scop
- [ ] Materiale concrete, fără cuvinte goale (amazing, 8k)
- [ ] Textul din imagine e între ghilimele, cu font și poziție
- [ ] La editare: "change only…" + lista de păstrat
- [ ] Aspect ratio potrivit (4:5 feed, 9:16 story, 1:1, 16:9 banner)
- [ ] Fără branduri, persoane reale sau logo-uri străine
```
