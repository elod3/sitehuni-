---
name: reclame-magazin-muzica
description: Creează reclame video și foto cu AI pentru un magazin de instrumente muzicale și echipamente audio (chitări, clape, tobe, amplificatoare, viniluri). Acoperă cadre de produs cu lumină de scenă, concepte de reclame (instrumentul lunii, începători, cadouri, service), atenția la branduri și logo-uri, hook-uri în română. Se folosește la conținut pentru magazinul de muzică al clientului sau pentru retail cu produse tehnice.
---

# Reclame pentru magazin de muzică

Pentru prompturi folosește și `prompturi-video-ai` și `prompturi-imagini-ai`.

## Principiul

Cine cumpără un instrument cumpără **cine vrea să devină**: primul riff, prima trupă, cadoul pentru copil. Reclama arată sunetul și momentul, nu doar obiectul.

## Atenție mare: branduri

Magazinul vinde branduri reale (Fender, Yamaha, Roland etc.). Modelele AI:
- **refuză sau blochează** prompturile cu nume de branduri (`ip_detected`);
- **deformează** logo-urile și formele specifice.

Deci:
- **Nu** genera cu AI instrumentul de brand ca produs principal. Folosește **poze sau filmări reale** ale produsului din magazin.
- AI-ul se folosește pentru **atmosferă și b-roll**: scenă, lumini, mâini pe corzi generice, sala magazinului, animarea unei poze reale (mișcare de cameră, lumini).
- La I2V pe poza reală: `Keep the instrument, logo and hardware exactly as in the image. Only the camera and lights move.` Verifici logo-ul cadru cu cadru.
- Folosirea logo-urilor de producător în reclame poate avea reguli de la distribuitor. Clientul trebuie să confirme.

## Cadre-semnătură

```
Strum macro: Extreme close-up of a hand strumming steel strings on a generic acoustic guitar, strings vibrating, warm rim light, shallow depth of field.
Shop wall: Slow lateral tracking shot along a wall of electric guitars in a warm-lit music shop, amber and teal practical lights.
Amp knobs: Macro on vintage amplifier knobs being turned up, glowing tube light behind the grille, moody low-key lighting.
Stage dream: A teenager plays guitar in a small bedroom, then match cut to the same pose on a small club stage with haze and light beams.
Vinyl: Close-up of a vinyl record being placed on a turntable, needle drop, dust particles in a warm light beam.
Drums: Slow-motion drumstick hitting a cymbal, shimmer, stage haze, backlight.
```

Lumina: `hard rim light`, `stage haze with light beams`, `warm practicals`, `colored gels (amber and teal)`. Paleta: `low-key moody` pentru rock, `warm and cozy` pentru acustic și cadouri.

## Concepte

1. **Instrumentul lunii**: filmare reală a produsului + b-roll AI + preț și ofertă.
2. **Începători**: „Prima ta chitară sub X lei. Te ajutăm să alegi.” Pachet chitară + husă + acordor.
3. **Cadouri**: Crăciun, zile de naștere, 1 iunie. Instrument cu fundă, reacția copilului (UGC cu `marketing_studio_video --mode ugc`).
4. **Din dormitor pe scenă**: transformare (match cut). Emoțional, bun pentru awareness.
5. **Service și setup**: încredere; mâinile tehnicianului, schimbat de corzi.
6. **Test în magazin**: „Vino să încerci”. Invitație în magazinul fizic, adresa.

## Hook-uri

- „Primul tău riff începe aici.”
- „Ai 30 de secunde? Ascultă asta. 🎸🔊”
- „Chitară pentru începători: ce trebuie să știi înainte să cumperi.”
- „Nu cumpăra online înainte să încerci.”
- „Cadoul de care o să-și amintească.”

## Site-ul magazinului

Conținutul generat aici se folosește și pe site (hero video, bannere de categorie). Formate: 16:9 sau 21:9 pentru hero, 4:5 pentru social. Video-urile pentru site trebuie scurte (5–8 s), în buclă și fără sunet.
