# Prompturi exemplu: Arcadian Residence

Toate sunt image-to-video pe `seedance_2_5 --mode omni_reference`, 1080p. Testezi întâi la 720p.

## Cuprins
- Reel „O zi acolo” (5 clipuri)
- Reel „15 minute”
- Tur Tip 2
- Imagini statice pentru feed
- Prompt multi-shot într-o singură generare

## Reel „O zi acolo” (15 s, 9:16, montat din 5 clipuri)

**Clip 1: hook, fațada la blue hour** (`ext-fatada`, 4 s)
```
Slow lateral tracking shot moving right along the facade, camera at eye level on the lawn.
Warm interior lights glow and a few more windows light up one by one. Tree leaves move gently in a light evening breeze.
Keep the architecture, window layout, balconies, materials and proportions exactly as in the image. Stable geometry, straight vertical lines, smooth gimbal, no zoom.
Audio: soft evening ambience, distant birds.
```

**Clip 2: aleea dimineața** (`ext-alee`, 3 s)
```
Slow dolly forward along the pedestrian path at walking height.
Soft morning sunlight, light mist fading, grass gently moving.
Keep all buildings, paving and landscaping exactly as in the image. Stable geometry, no zoom.
```

**Clip 3: living, lumină de dimineață** (`t2-living`, 3 s)
```
Very slow push in toward the sofa and kitchen island.
Morning sunlight slowly moves across the floor and sofa, sheer curtain moves slightly.
Keep furniture, materials, layout and proportions exactly as in the image. No people, no zoom.
```

**Clip 4: detaliu de confort** (`t2-dormitor`, 2–3 s)
```
Locked-off static camera. Sunlight slowly shifts across the bed linen, dust particles drift in the light beam.
Keep the room exactly as in the image.
```

**Clip 5: final la apus** (`ext-calcan`, 3–4 s)
```
Slow crane up and gentle pull back, revealing more of the sky.
Golden sunset light warms the facade, lights inside turn on.
Keep the architecture exactly as in the image. Stable geometry.
Leave calm empty sky in the upper part of the frame for a logo.
```

**Montaj:** text pe ecran clip 1: „Casă cu grădină. 15 min de Târgu Mureș.” · clip 3: „Living luminos, încălzire în pardoseală” · final: logo + „Tur virtual: 0769 296 668” + mică mențiune „Imagini de prezentare, orientative”.

## Reel „15 minute”

Primul cadru (oraș aglomerat) nu există în randări, deci îl generezi text-to-video:

```
5s, 9:16. Busy city intersection at rush hour in a mid-sized Central European city, cars in traffic, grey overcast light.
Camera: static, eye level. Realistic, documentary look, muted colors.
Audio: traffic noise, car horns.
```

Apoi hard cut la clipul 1 de mai sus (liniște, lumini calde). Contrastul sonor (trafic → păsări) este hook-ul. Text: „Lucrezi aici…” → „…locuiești aici. La 15 minute.”

## Tur Tip 2 (start + end frame)

`--start-image t2-living --end-image t2-bucatarie`, 6 s:
```
Smooth continuous camera move from the living area turning gently toward the kitchen, as if walking through the apartment.
Soft daylight, consistent warm color grade.
Keep all furniture, materials and architecture exactly as in the start and end images. Stable geometry, no distortion.
```
Dacă tranziția se deformează: fă două clipuri separate și pune cut între ele. Arată mai bine decât o tranziție stricată.

## Imagini statice pentru feed (editare pe randare, `gpt_image_2_5`)

Adăugare de viață într-o randare goală:
```
Add a young couple sitting on the garden bench in front of the facade, seen from behind, holding coffee cups, relaxed evening mood.
Change only this. Keep the building, windows, trees, lighting and camera angle exactly the same.
Photorealistic, people small in frame, natural poses.
```

Varianta de iarnă (pentru mesajul nZEB):
```
Change only the season to a calm winter evening: light snow on the grass, trees and roof edges, soft snowfall.
Keep the building, windows, warm interior lights and camera angle exactly the same.
```

## Prompt multi-shot într-o singură generare (alternativă la montaj)

Cu 3 referințe (`@image1` fațada, `@image2` aleea, `@image3` living):
```
15s, 9:16, 3 shots, hard cuts, consistent warm dusk color grade across shots.
@image1 provides the facade architecture and materials. @image2 provides the garden path. @image3 provides the living room interior.
[0-5s] Shot 1: slow lateral tracking shot along the facade from @image1, interior lights turning on.
[5-10s] Shot 2: slow dolly forward along the path from @image2.
[10-15s] Shot 3: slow push in toward the sofa in @image3, warm lamp light.
Keep all architecture, furniture and materials exactly as in the references. Stable geometry, straight vertical lines.
Audio: calm ambient evening sounds, soft piano, no dialogue.
```
Montajul din clipuri separate îți dă mai mult control. Varianta multi-shot e mai rapidă, dar mai greu de reparat.
