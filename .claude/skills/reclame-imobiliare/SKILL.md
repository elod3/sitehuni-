---
name: reclame-imobiliare
description: Creează reclame video și imagine pentru ansambluri rezidențiale și apartamente în construcție (off-plan), pornind de la randări, planuri și broșură. Acoperă concepte de reclamă, hook-uri, storyboard pentru Reels și Meta Ads, animarea randărilor fără deformări, texte de reclamă în română și regulile de conformitate (Meta Special Ad Category pentru locuințe, eticheta AI, fără promisiuni false). Se folosește pentru Arcadian Residence sau orice alt proiect imobiliar.
---

# Reclame imobiliare (off-plan)

Pentru prompturi video și imagine folosește și skill-urile `prompturi-video-ai` și `prompturi-imagini-ai`. Aici e partea specifică pentru imobiliare: **ce** să arăți și **de ce**.

## Principiul

Oamenii nu cumpără metri pătrați, cumpără **viața de acolo**. Reclama răspunde la întrebarea „cum ar arăta dimineața mea acolo?”. Randarea e dovada. Emoția vine din mișcare, lumină și ritm.

## Material de pornire

- **Randările originale la rezoluție mare de la arhitect.** Cele scanate din broșură au textură de print și dau video-uri mai slabe. Cere-le.
- Planurile apartamentelor, fișa tehnică, prețurile și disponibilitatea.
- Pentru Arcadian Residence: faptele verificate sunt în [reference/arcadian.md](reference/arcadian.md).

## Regula de aur la animarea randărilor

Randarea e **sursa de adevăr**. Video-ul are voie să adauge mișcare de cameră, lumină, vânt, oameni mici și lumini aprinse. **Nu are voie** să schimbe arhitectura: ferestre, etaje, materiale, balcoane.

- `seedance_2_5 --mode omni_reference --start-image <randare>`
- Mișcări lente: `slow dolly in`, `slow lateral tracking`, `slight crane up`, orbit de maximum ~30°.
- 5–8 s pe clip. Cele lungi se deformează mai des.
- Fraza de blocare în **fiecare** prompt: `Keep the architecture, window layout, materials and proportions exactly as in the image. Stable geometry, straight vertical lines.`
- Verifici **fiecare** clip cadru cu cadru. Dacă apare un balcon în plus, o fereastră mutată sau un etaj în plus, clipul se aruncă. Asta e deja publicitate înșelătoare.

## Concepte de reclamă care funcționează

1. **„O zi acolo”**: dimineață (cafea pe terasă) → zi (copii în grădină) → seară (luminile aprinse, blue hour). 15 s, 4–5 cadre.
2. **„15 minute”**: navetă scurtă. Cadru de oraș aglomerat → drum → liniștea ansamblului. Hook: „Lucrezi în Târgu Mureș. Locuiești aici.”
3. **Tur de apartament**: fațadă → intrare → living → dormitor, cu suprafețele pe ecran (text în montaj cu suprafața reală din plan, de exemplu „Living XX m²”).
4. **Detaliu tehnic ca beneficiu**: nZEB, tripan, încălzire în pardoseală → „facturi mici iarna”. Cadru macro pe fereastră cu zăpadă afară și cald înăuntru.
5. **Comparația**: „Apartament la bloc în oraș vs. casă cu grădină la 15 min”. Split-screen în montaj.
6. **Ultimele unități / lansare**: urgență reală, doar dacă e adevărat.

## Structura unui reel de 15 s

```
0–2 s   HOOK: mișcare puternică sau imaginea cea mai frumoasă + text scurt pe ecran
2–10 s  DOVADA: 2–3 cadre (exterior, interior, detaliu), câte 3 s
10–13 s BENEFICIUL: cel mai important fapt (15 min / nZEB / grădină)
13–15 s CTA: logo + „Sună pentru tur virtual: 0769 296 668” (text în montaj)
```

- Primul cadru **nu** e logo-ul și nici un cadru static. Mișcare din prima secundă.
- Subtitrări mereu. ~80% din oameni se uită fără sunet.
- Voiceover în română: voce reală sau TTS bun, **nu** dialog generat de modelul video.
- Muzică fără copyright: generată (`seed_audio`, `sonilo_music`) sau din biblioteca Meta sau TikTok.

## Hook-uri (text pe ecran sau voiceover)

- „Lucrezi în Târgu Mureș. Dimineața ta începe aici.”
- „Casă cu grădină, la 15 minute de oraș.”
- „Cât plătești la căldură într-o casă nZEB?”
- „71 m², intrare directă din grădină. Pentru primul vostru cămin.”
- „Nu e bloc. Nu e casă departe de tot. E la mijloc.”
- „Asta e privirea de pe balconul de 8,43 m².”

Scrie variante care testează **unghiuri diferite** (navetă / economie / familie / investiție), nu reformulări ale aceleiași idei.

## Textul reclamei (Meta)

```
[Hook, 1 rând]
[2–3 beneficii concrete, cu cifre reale]
[Dovadă: arhitect, standard, suprafețe]
[CTA clar + telefon]
```

Exemplu:

```
Casă cu grădină, la 15 minute de Târgu Mureș. 🌿
• Standard nZEB, tripan și încălzire în pardoseală
• Apartamente de 71,3 m² și 122,26 m²
• 40% din ansamblu rămâne spațiu verde
Proiect semnat Studio Holm și Inhabit Studio.
Sună pentru turul virtual 3D: 0769 296 668
```

## Conformitate (obligatoriu)

- **Meta Special Ad Category „Housing”.** Reclamele imobiliare trebuie marcate la categoria specială. Se blochează targetarea după vârstă, gen și cod poștal, iar raza minimă e mare. Creativul trebuie să atragă singur publicul potrivit.
- **Eticheta AI.** Conținutul generat sau modificat semnificativ cu AI se marchează în Ads Manager (toggle-ul de AI). Meta detectează și singur metadatele C2PA, iar nemarcarea duce la respingeri și strike-uri pe cont.
- **Adevăr.** Doar ce e în proiect: suprafețe, finisaje, dotări. Pe randări și clipuri adaugi mențiunea „Imagini de prezentare, cu caracter orientativ” (în montaj sau în textul reclamei). Nu inventa facilități (piscină, parc de joacă) care nu sunt în proiect.
- **Fără oameni reali** fără acordul lor și fără branduri străine în cadru.
- Prețuri și „ultimele unități” doar cu confirmarea clientului.

## Workflow

```
- [ ] 1. Brief: obiectiv (lead-uri / awareness), public, buget, platforme, faptele verificate
- [ ] 2. 3 concepte scurte → clientul alege 1–2
- [ ] 3. Storyboard pe secunde + ce randare se folosește la fiecare cadru
- [ ] 4. Test ieftin (480p / 720p) pe cadrul cel mai riscant
- [ ] 5. Generare finală 1080p, 9:16 (plus 4:5 sau 1:1 pentru feed)
- [ ] 6. QA cadru cu cadru: arhitectura e identică cu randarea?
- [ ] 7. Montaj: subtitrări, text, CTA, logo, mențiune „orientativ”
- [ ] 8. Virality Predictor (`brain_activity`) pe varianta finală, opțional
- [ ] 9. Livrare + 2–3 variante de hook pentru test A/B
```

Exemple de prompturi gata făcute pe randările Arcadian sunt în [reference/prompturi-exemple.md](reference/prompturi-exemple.md).
