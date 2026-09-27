---
name: realism-si-lumina
description: Face imaginile și video-urile AI să arate ca fotografii și filmări reale, nu „AI”. Limbaj fotografic (cameră, lentilă, expunere), scheme de lumină numite (fereastră, Rembrandt, rim, practicals, golden/blue hour, high-key/low-key), temperatură de culoare, imperfecțiuni controlate, fizică realistă în video și lista semnelor care trădează AI-ul, cu reparații. Se folosește când un rezultat arată fals, plastic sau prea perfect, când clientul cere „să pară real” sau când se alege lumina pentru o scenă.
---

# Realism și lumină

Completează `prompturi-imagini-ai` și `prompturi-video-ai`. Prompturile se scriu în engleză.

## De ce arată ceva „AI”

Cuvântul `photorealistic` singur nu mai ajută. Toată lumea îl scrie, iar rezultatul mediu e neted, ceros și perfect simetric. Realismul vine din **trei lucruri pe care le are o poză reală**:

1. **Lumina vine de undeva**: o sursă cu direcție, calitate (dură sau moale) și culoare.
2. **Un aparat a făcut poza**: lentilă, adâncime de câmp, expunere, zgomot sau grăunte.
3. **Lumea e imperfectă**: praf, firimituri, cute, pori, obiecte puțin strâmbe.

Deci **nu** scrii adjective (`realistic`, `high quality`, `8k`, `ultra detailed`, `masterpiece`), care fac imaginea *mai* falsă. Scrii **condițiile fizice** în care s-ar fi făcut poza.

## Formula de realism

```
[Sursa de lumină: ce, de unde, ce calitate, ce culoare]
[Aparat: tip de fotografie + lentilă + adâncime de câmp + expunere]
[Imperfecțiuni: 2–3, concrete, potrivite scenei]
[Culoare / grade: natural, fără saturație exagerată]
```

Exemplu (interior imobiliar):

```
Late afternoon sun entering through a large window on the left, hard light with long warm shadows across the oak floor, the rest of the room filled with soft bounce light.
Shot on a full-frame camera with a 24mm lens at eye level, f/8, deep focus, slightly underexposed to hold the highlights.
A folded blanket slightly askew on the sofa, a half-read book, faint dust in the sunbeam.
Natural color, neutral white balance, no oversaturation.
```

Diferența față de „beautiful photorealistic living room, 8k”: modelul are acum **motive fizice** pentru fiecare umbră.

## Lumina: cele 4 decizii

Pentru fiecare scenă alegi explicit:

| Decizie | Opțiuni | Cum sună în prompt |
|---|---|---|
| **Sursa** | soare, fereastră, lampă, cuptor, neon, cer înnorat, bliț | `light from a single window`, `lit by the oven glow` |
| **Direcția** | din lateral, din spate (contre-jour), de sus, frontal | `from the left`, `backlit`, `top light` |
| **Calitatea** | dură (umbre clare) / moale (umbre difuze) | `hard direct sun`, `soft diffused overcast light` |
| **Culoarea** | caldă ~2700–3500 K / neutră ~5500 K / rece ~7000 K+ | `warm tungsten 3000K`, `cool blue hour ambient` |

Regulă de aur: **o singură sursă dominantă** + umplere moale. Mai multe surse puternice din direcții diferite = aspect de randare 3D.

**Lumina motivată:** fiecare lumină din cadru trebuie să aibă o sursă plauzibilă (fereastră, lampă, cuptor). Asta face diferența între „film” și „CGI”.

Schemele complete de lumină, gata de copiat pe nișe, sunt în [reference/scheme-lumina.md](reference/scheme-lumina.md).

## Aparatul foto

- **Tipul fotografiei** spune modelului ce „estetică” să imite: `editorial interior photograph`, `candid smartphone photo`, `documentary photo`, `commercial food photograph`, `35mm film snapshot`.
- **Lentila**: 24mm interior, 35mm lifestyle, 50mm natural, 85mm portret, 100mm macro.
- **Adâncimea de câmp**: `f/1.8 shallow depth of field` (subiect izolat) sau `f/8 deep focus` (arhitectură).
- **Expunerea**: `slightly underexposed`, `highlights clipping in the window`, `natural exposure`. Pozele reale nu sunt perfect expuse peste tot.
- **Zgomot și grăunte**: `subtle film grain` / `fine sensor noise, ISO 800`. Puțin, nu mult.
- **Defecte optice discrete**: `slight vignetting`, `subtle chromatic aberration at the edges`, `lens flare from the sun`. Maxim unul sau două.

**UGC / „făcut cu telefonul”** (reclame care nu par reclame): `candid smartphone photo, slightly tilted framing, mixed indoor lighting, natural phone HDR look, casual composition`.

## Imperfecțiuni controlate

Alege 2–3 potrivite scenei, nu o listă lungă:
- **Mâncare:** firimituri, făină presărată neuniform, un croissant puțin mai rumen, aburi, urme de unt.
- **Interior:** pătură pusă neglijent, pernă turtită, carte deschisă, praf în raza de soare, dungi pe covor.
- **Exterior:** frunze pe alee, băltoace după ploaie, iarbă neuniformă, urme de roți.
- **Oameni:** `natural skin texture with visible pores`, `slight redness`, `flyaway hairs`, `wrinkled shirt`, expresie în mișcare (nu zâmbet de poză).
- **Obiecte:** zgârieturi fine, amprente pe sticlă, etichete puțin strâmbe.

Imperfecțiunile nu au voie să schimbe **produsul clientului** (forma pâinii, fațada). Ele țin doar de scenă.

## Realism în video

- **Viteză reală**: `real-time speed, natural pace`. Slow motion peste tot = semn de AI. Slow motion doar la abur, pudră, stropi.
- **Fizică**: lucrurile au greutate. `the loaf lands with a soft thud and slight bounce`, `fabric settles naturally`, `steam drifts and dissipates`.
- **Cameră umană**: `subtle handheld micro-movement` sau `smooth gimbal`, nu mișcări perfect matematice.
- **Lumina e constantă**: dacă soarele e din stânga în cadrul 1, rămâne din stânga în toate. Scrie asta explicit la multi-shot.
- **Oamenii fac acțiuni simple**: țin, pun jos, se uită, merg. Acțiunile complexe cu degetele trădează AI-ul.

## Semnele de AI și reparația lor (QA)

| Semn | Reparație |
|---|---|
| Piele ceroasă, netedă | `natural skin texture, visible pores, no retouching`; lumină laterală, nu frontală |
| Totul perfect simetric și curat | 2–3 imperfecțiuni concrete; compoziție ușor descentrată |
| Lumină din toate părțile, fără umbre | o sursă dominantă cu direcție; `deep natural shadows` |
| Culori prea saturate, „HDR” | `natural muted color`, `neutral white balance`; scoate `vibrant`, `vivid` |
| Glow / bloom peste tot | scoate `cinematic`, `dreamy`, `ethereal`; `crisp` |
| Fundal blurat exagerat la toate pozele | `f/5.6`, `moderate depth of field` |
| Text de fundal fără sens (firme, etichete) | fundal fără text sau fundal simplificat; textul real îl pui în montaj |
| Degete sau mâini ciudate | încadrare fără degete în detaliu; acțiuni simple |
| Obiecte care se topesc unele în altele | mai puține obiecte în cadru; compoziție mai simplă |
| Ochi fără viață (video) | `natural blinking, eyes tracking the object` |

## Checklist

```
- [ ] Fără adjective goale (photorealistic, 8k, ultra detailed, masterpiece)
- [ ] Sursa de lumină: ce + direcție + calitate + culoare
- [ ] O singură lumină dominantă, motivată
- [ ] Tipul fotografiei + lentila + adâncimea de câmp
- [ ] 2–3 imperfecțiuni concrete, care nu ating produsul clientului
- [ ] Video: viteză reală, fizică, lumină constantă între cadre
- [ ] QA pe tabelul „semne de AI” înainte de livrare
```
