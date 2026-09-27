---
name: prompturi-video-ai
description: Scrie prompturi pentru generare video AI (Seedance 2.5/2.0, Kling 3.0, Veo 3.1, Cinema Studio, Marketing Studio pe Higgsfield). Acoperă text-to-video, image-to-video, start/end frame, omni-reference cu @image1/@video1/@audio1, multi-shot, timeline cu secunde, mișcări de cameră, audio și dialog. Se folosește când trebuie scris sau reparat un prompt video, un storyboard de reclamă, un reel sau o animație pornind de la o randare sau poză.
---

# Prompturi video AI

Skill-ul acesta produce prompturi care pot fi trimise direct la un model video. Prompturile se scriu **în engleză** (modelele sunt antrenate majoritar pe engleză). Explicațiile către utilizator sunt în română.

## Regula de bază

Un prompt video este o **indicație de regie**, nu o listă de obiecte. Spune cine e în cadru, ce face, cum se mișcă camera și ce se aude, în ordinea în care se întâmplă.

Primele 20–30 de cuvinte contează cel mai mult: modelul fixează subiectul și acțiunea principală din deschidere. Începe mereu cu subiectul și acțiunea.

## Formula (text-to-video)

```
[Format: durată, aspect ratio, număr de cadre]
[Subiect precis] + [acțiune concretă]
[Loc / mediu]
[Lumină și culoare]
[Cameră: o singură mișcare + viteză + stabilizare]
[Stil / textură de film]
[Audio: ambient, SFX, muzică, dialog]
[Constrângeri: ce rămâne fix]
```

Exemplu:

```
8s, 9:16, single continuous shot.
A fresh sourdough loaf is pulled from a stone oven on a wooden peel, steam rising from the cracked golden crust.
Small artisan bakery at dawn, flour dust hanging in the air.
Warm tungsten practical light from the oven, soft blue window light from the left, warm-cool contrast.
Camera: slow dolly in toward the loaf, smooth gimbal, no zoom.
Shot on 35mm, shallow depth of field, gentle film grain.
Audio: crackle of the cooling crust, quiet room tone, no music.
Keep the loaf shape and scoring pattern consistent throughout.
```

## Image-to-video (cel mai folosit pentru reclame)

Când dai o imagine de start (`--start-image` sau `@image1`), **descrie mișcarea, nu redescrie imaginea**. Modelul vede deja poza. Dacă o redescrii, o reinterpretează și schimbă detalii.

- Rău: `a modern white house with dark metal upper floor and trees, camera moves`
- Bine: `Camera slowly pushes forward along the path toward the entrance. Leaves move gently in a light breeze. Warm interior lights flicker on one by one. Keep the architecture, window positions and materials exactly as in the image.`

Pentru arhitectură, produse și logo-uri adaugă mereu o frază de blocare: `Keep [geometria / eticheta / textul / forma] exactly as in the reference.`

## Start + end frame

Pentru tranziții (de exemplu fațadă → living): dai prima și ultima imagine, iar promptul descrie **drumul** dintre ele: tipul de mișcare, ce se întâmplă pe parcurs și ritmul. Ambele cadre trebuie să aibă aceeași lumină și aceeași paletă, altfel tranziția „se topește” urât.

## Omni-reference (Seedance 2.5 / 2.0)

Referințele se numesc în ordinea încărcării: `@image1`, `@image2`, `@video1`, `@audio1`. **Fiecare referință primește o propoziție cu rolul ei**, adică ce parte din ea se folosește:

```
@image1 provides the building facade, materials and window layout. Do not use its sky.
@image2 provides the warm dusk color grade and lighting mood.
@video1 provides only the camera movement: a slow lateral tracking shot.
```

Consistența vine din referințe cu rol clar, nu din repetarea descrierii în text. Detalii pe modele în [reference/modele.md](reference/modele.md).

## Multi-shot și timeline

Pentru clipuri de peste ~6 s sau cu mai multe cadre, anunță structura sus și împarte pe secunde:

```
15s, 9:16, 4 shots, hard cuts, consistent lighting and color across shots.

[0-3s] Shot 1: Close-up. Hands dust flour over dough on a wooden table. Static camera.
[3-7s] Shot 2: Medium shot. Baker scores the loaf with a blade, slow push in.
[7-11s] Shot 3: Macro. Crust crackles and splits in the oven, time-lapse feel.
[11-15s] Shot 4: Wide. Finished loaves on the counter, morning light, slow pull back.
Audio: soft acoustic guitar, low; SFX: blade scoring, oven door, crust crackle.
```

Reguli:
- **Un singur tip de mișcare de cameră pe cadru.** Trei mișcări într-un cadru („dolly in while orbiting and tilting up”) înseamnă cea mai frecventă cauză de clip haotic.
- Subiectul se descrie **identic** în fiecare cadru (aceleași cuvinte), ca să nu se schimbe.
- 3–4 secunde pe cadru e ritmul bun pentru reels. Sub 2 s modelul nu apucă să execute acțiunea.

Vocabularul complet de cameră, lentile și lumină e în [reference/camera.md](reference/camera.md).

## Audio și dialog

- Scrie audio separat, pe rândul lui, cu etichetă: `Audio:` / `SFX:` / `Ambient:` / `Music:`.
- Dialog între ghilimele, legat de un personaj: `The baker smiles and says, "Fresh every morning."`
- Kling 3.0: `[Baker, warm friendly voice]: "Fresh every morning."` Descrie întâi acțiunea, apoi replica.
- Pentru liniște: `No music, no dialogue.`
- **Nu te baza pe dialog în română generat de model.** Pronunția e adesea greșită. Pentru reclame în română pune voiceover separat (TTS sau voce reală) și subtitrări în montaj.

## Negative și constrângeri

Majoritatea modelelor nu au câmp de negative prompt. Formulează **pozitiv** ce vrei:
- în loc de `no blur` → `tack sharp`
- în loc de `no people` → `empty street, uninhabited`
- pentru POV sau cadre fixe spune explicit ce **nu** face camera: `no cuts, no zoom, locked-off tripod`

Formulare utile care chiar funcționează: `photorealistic, no CGI look`, `natural skin texture, visible pores`, `stable geometry, straight vertical lines`.

## Lungime

- T2V: 40–120 de cuvinte e zona bună. Peste ~200 de tokeni modelele încep să ignore sau să amestece instrucțiuni.
- I2V: 20–60 de cuvinte, doar mișcare și ce rămâne fix.
- Multi-shot: câte 1–2 fraze pe cadru.

## Checklist înainte de trimitere

```
- [ ] Formatul e sus (durată, aspect ratio, nr. cadre)
- [ ] Subiectul și acțiunea sunt în primele 20–30 de cuvinte
- [ ] Câte o singură mișcare de cameră pe cadru
- [ ] La I2V: descrie doar mișcarea, plus o frază de blocare
- [ ] Referințele au fiecare un rol scris
- [ ] Audio e pe rând separat
- [ ] Fără nume de branduri străine, persoane reale sau personaje cu copyright
- [ ] Aspect ratio potrivit platformei (9:16 Reels/TikTok, 1:1 sau 4:5 feed, 16:9 YouTube/site)
```

## Când iese prost

Vezi [reference/depanare.md](reference/depanare.md). Regula de iterație: **schimbă un singur lucru pe rând**. Dacă după 3–4 încercări același cadru tot nu merge, schimbă abordarea (altă imagine de start, alt model, cadru mai simplu) în loc să lungești promptul.
