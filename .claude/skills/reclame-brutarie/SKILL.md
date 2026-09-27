---
name: reclame-brutarie
description: Creează reclame video și foto cu AI pentru brutării, patiserii și cafenele locale (Reels, TikTok, Meta Ads, Google Business). Acoperă food cinematography (abur, crustă, straturi, slow motion), pornirea de la poze reale ale produselor, concepte sezoniere, calendar lunar de conținut, hook-uri și texte în română. Se folosește când se face conținut pentru brutăria clientului sau pentru orice afacere locală cu mâncare.
---

# Reclame pentru brutărie

Pentru prompturi folosește și `prompturi-video-ai` și `prompturi-imagini-ai`. Aici e partea specifică.

## Principiul

Mâncarea se vinde prin **simțuri**: abur, crustă care trosnește, unt care se topește, sunetul feliei. Reclama trebuie să facă omul să-i fie foame în 2 secunde. Și să știe **unde** și **când** găsește produsul.

## Regula de aur: produsul real

Clientul vinde pâinea **lui**, nu o pâine generică. Dacă AI-ul inventează un croissant perfect pe care brutăria nu-l face așa, clienții se simt păcăliți la tejghea.

- Fotografiezi produsele reale cu telefonul: lumină de la geam, fundal simplu, 3–4 unghiuri.
- Le folosești ca referință: `--image` sau `--start-image`, ori le salvezi ca produse în Marketing Studio (`higgsfield marketing-studio products create`).
- AI-ul face **scena, lumina și mișcarea**. Forma, culoarea și decorul produsului rămân ca în poză.
- Fraza de blocare: `Keep the pastry's exact shape, color, scoring pattern and toppings as in the reference.`

## Unelte

| Ce | Cum |
|---|---|
| Poze de produs pentru feed sau meniu | skill-ul oficial `higgsfield-product-photoshoot` (moduri `product_shot`, `lifestyle_scene`, `ad_creative_pack`) cu poza reală |
| Video de produs „wow” | `seedance_2_5 --mode omni_reference --start-image <poză>` |
| Reclamă cu om care recomandă (UGC) | `marketing_studio_video --mode ugc` sau `product_review`, cu produsul salvat |
| Spot „de televizor” | `marketing_studio_video --mode tv_spot` |
| Muzică și SFX | `seed_audio` |

## Cadre-semnătură (bibliotecă de shot-uri)

```
Tearing: Hands tear a warm loaf in half, steam rising, soft crumb stretching. Macro, backlight, slow motion.
Oven reveal: Oven door opens, burst of steam, golden loaves on the tray. Warm practical light from the oven.
Croissant layers: Extreme macro slowly tracking across the flaky layers of a croissant, crumbs falling.
Butter melt: A knob of butter slowly melting on a warm slice of bread, glossy, real-time speed.
Sugar dust: Powdered sugar sifting in slow motion over pastries, backlit, particles glowing.
Coffee pairing: Hand places a cup of coffee next to a croissant on a wooden counter, morning window light.
Shelf pan: Slow lateral tracking shot along a full bakery shelf in the morning, warm lights.
Baker hands: Close-up of flour-covered hands shaping dough, handheld subtle movement, documentary feel.
```

Lumina bună: `soft window light from the side` + `backlight` pentru abur și zahăr pudră. Mișcarea bună: `slow motion` **doar** la abur, zahăr și făină; restul `real-time speed`.

## Concepte care merg la afaceri locale

1. **„7:00 dimineața”**: pâinea iese din cuptor; ora și adresa pe ecran. Urgență naturală: „caldă doar dimineața”.
2. **ASMR crustă**: 8 s, doar sunetul feliei și al crustei. Fără muzică.
3. **Produsul săptămânii**: un produs, 3 cadre, preț, „doar până duminică”.
4. **Din culise**: mâini de brutar, aluat, cuptor. Autenticitate (bine cu imagini reale + AI pentru b-roll).
5. **Sezonier**: cozonac (Crăciun, Paște), pască, plăcinte de toamnă cu dovleac, mărțișor (1 martie). Planificat cu 2 săptămâni înainte.
6. **Comenzi pentru evenimente**: torturi, platouri, „comandă cu 48 h înainte”.

## Structura unui reel de 10–15 s

```
0–2 s   HOOK senzorial (rupt, abur, cuptor) + text: „Caldă de la 7:00”
2–8 s   2–3 cadre de produs (macro, textură, mâini)
8–12 s  Contextul: tejgheaua, oameni care cumpără, cafeaua
12–15 s CTA: nume, adresă sau cartier, program (text în montaj)
```

## Hook-uri și texte în română

- „Pâine caldă de la 7:00. Până se termină.”
- „Ascultă crusta asta. 🔊”
- „Croissant cu unt adevărat. Se vede.”
- „Cozonacul de Crăciun se comandă de acum.”
- „Nu e de la supermarket. E de la noi, din cuptor.”

Text de reclamă (Meta, local):
```
Pâine caldă în fiecare dimineață, de la 7:00. 🥖
Făcută pe loc, din aluat cu maia, fără amelioratori.   ← doar dacă e adevărat!
📍 [adresa] · ⏰ [program]
Comenzi pentru torturi și platouri: [telefon]
```

## Targetare (Meta, local)

- Raza 3–10 km în jurul brutăriei; obiectiv „Store traffic” sau „Awareness” cu buget mic zilnic.
- Postări organice zilnice, plus 1–2 reclame plătite pe săptămână cu cel mai bun reel.
- Google Business Profile: poze noi săptămânal. Contează mult pentru „brutărie lângă mine”.

## Calendar lunar (pachet 8–12 materiale)

```
Săpt. 1: 1 reel semnătură (produsul vedetă) + 2 poze feed
Săpt. 2: 1 reel ASMR + 1 poză „produsul săptămânii”
Săpt. 3: 1 reel din culise + 2 poze
Săpt. 4: 1 reel sezonier sau de comenzi + 1 poză ofertă
```

## Conformitate

- Nu promite ingrediente sau proprietăți nereale („fără gluten”, „bio”, „fără zahăr”) fără confirmarea clientului.
- Eticheta AI în Ads Manager la conținutul generat.
- Fără branduri străine în cadru (cafea, băuturi).
