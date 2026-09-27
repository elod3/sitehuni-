# Note pe modele video (Higgsfield)

Lista de modele și parametrii se schimbă des. **Sursa de adevăr e CLI-ul:**

```bash
higgsfield model list
higgsfield model get <model_id> --json | jq '{aspect_ratios, durations, parameters, medias}'
```

## Cuprins
- Care model pentru ce
- Seedance 2.5
- Seedance 2.0
- Kling 3.0 / 3.0 Turbo
- Veo 3.1
- Marketing Studio
- Cinema Studio 4.0

## Care model pentru ce

| Nevoie | Model | De ce |
|---|---|---|
| Default, calitate maximă, I2V, multi-shot, referințe | `seedance_2_5` | 4–30 s, până la 1080p, moduri t2v / omni_reference / video_edit / video_extension |
| Ai nevoie de 4K | `seedance_2_0` | 4–15 s, până la 4K |
| Reclamă cu prezentator, UGC, unboxing, TV spot | `marketing_studio_video` | construit pentru reclame, lucrează cu produse și avatare salvate |
| Ieftin sau rapid, mișcare simplă | `kling3_0_turbo`, `veo3_1_lite` | iterații ieftine, testare de concept |
| Dialog cu sincronizare de buze, realism mare | `veo3_1` | audio nativ foarte bun; doar 4 / 6 / 8 s, 16:9 sau 9:16 |
| Multi-shot cu dialog pe personaje | `kling3_0` | până la 6 cadre, 3–15 s, dialog pe personaje |

Strategie de cost: **testezi conceptul ieftin** (480p sau model turbo), apoi faci varianta finală pe `seedance_2_5` la 1080p. Verifici mereu costul înainte:

```bash
higgsfield generate cost seedance_2_5 --duration 10 --resolution 1080p
```

## Seedance 2.5

- Moduri: `t2v` (doar text, fără media), `omni_reference` (orice referință, inclusiv start/end frame), `video_edit`, `video_extension`.
- Pentru I2V: `--mode omni_reference --start-image ./randare.jpg`.
- Referințele în prompt se scriu `@image1`, `@image2`, `@video1`, `@audio1`, în ordinea încărcării. Fiecare primește o frază de rol: `@image1 provides …`.
- Ține minte: dacă `higgsfield model get seedance_2_5` arată alte nume de roluri decât cele de aici, ai încredere în schemă.
- Audio nativ (ambient, foley, muzică) în aceeași trecere. Controlat prin `--generate_audio`.
- Prompt scurt când referințele fac deja munca.

```bash
higgsfield generate create seedance_2_5 \
  --mode omni_reference \
  --start-image ./ext-fatada.jpg \
  --prompt "Camera slowly glides forward along the garden path toward the entrance. Warm lights turn on inside. Trees sway gently. Keep the facade geometry, materials and windows exactly as in the image." \
  --duration 8 --resolution 1080p --aspect_ratio 9:16 --wait
```

## Seedance 2.0

- Roluri media: `image`, `start_image`, `end_image`, `video`, `audio`.
- Audio de referință (de exemplu voce pentru lipsync) prin `--audio`. **Nu** îi da `--generate-audio`.
- Aspect ratio: auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16. Durată 4–15 s. Rezoluție până la `4k`.

## Kling 3.0 / 3.0 Turbo

- 16:9, 9:16, 1:1. Durată 3–15 s. Moduri `std` / `pro` / `4k` (3.0).
- `start_image` + `end_image` (3.0). Turbo acceptă doar `start_image`.
- Bun la fizică și mișcarea oamenilor. Scrie ca un regizor, pe cadre etichetate.
- Dialog: `[Label: descriere, tip de voce]: "replica"`. Etichete unice, fără pronume. Întâi acțiunea, apoi replica.

## Veo 3.1

- Doar 4, 6 sau 8 s. 16:9 sau 9:16. Un singur `start_image`.
- Formula Google: **Cinematografie + Subiect + Acțiune + Context + Stil și atmosferă**.
- Timestamp prompting: `[00:00-00:02] …`, `[00:02-00:04] …`
- Dialog între ghilimele; `SFX:` și `Ambient noise:` pe fraze separate.
- „Negative” formulat ca descriere a absenței: `a quiet street with no cars`.

## Marketing Studio (`marketing_studio_video`)

Pentru reclame propriu-zise. Moduri: `ugc`, `ugc_how_to`, `ugc_unboxing`, `product_showcase`, `product_review`, `tv_spot`, `wild_card`, `ugc_virtual_try_on`, `virtual_try_on`.

- Brutărie (produs fizic) → `product_showcase` sau `tv_spot`. Ori `ugc` dacă vrei un om care „recomandă”.
- Magazin muzică → `product_review` (cineva testează o chitară) sau `ugc_unboxing`.
- Imobiliare → de obicei **nu** e cea mai bună alegere. Clădirea nu e un „produs” de ținut în mână. Folosește `seedance_2_5` pe randări.

Produsele se salvează o dată (`higgsfield marketing-studio products create …`) și se refolosesc cu `--product_ids @fisier.json`. Detalii în skill-ul oficial `higgsfield-generate`.

## Cinema Studio 4.0 (`cinematic_studio_video_4_0`)

Aspect de film, cu controale de cameră, lentilă, lumină și gen. Nu apare în `model list`; verifici cu `higgsfield model get cinematic_studio_video_4_0`. Îl folosești când clientul vrea „look de film”.
