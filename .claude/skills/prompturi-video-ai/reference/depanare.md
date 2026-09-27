# Depanare: problemă → cauză → reparație

| Problemă | Cauză probabilă | Reparație |
|---|---|---|
| Clădirea se „topește”, liniile se îndoaie | mișcare prea rapidă sau prea complexă; model care reinterpretează imaginea | o singură mișcare lentă (`slow dolly`, `slow lateral tracking`); adaugă `stable geometry, straight vertical lines, keep architecture exactly as in the image`; durată mai scurtă (5–6 s) |
| Ferestrele sau balcoanele se schimbă | prompt care redescrie clădirea | la I2V scoate descrierea clădirii; lasă doar mișcarea și fraza de blocare |
| Camera face altceva decât ai cerut | mai multe mișcări în același cadru | una singură; spune și ce **nu** face: `no zoom, no orbit` |
| Clipul e haotic, cu tăieturi aleatorii | n-ai precizat structura | sus: `single continuous shot` sau `3 shots, hard cuts` |
| Subiectul (brutar, prezentator) se schimbă între cadre | descrieri diferite pe cadre | aceeași descriere cuvânt cu cuvânt; imagine de referință sau Soul ID |
| Textul sau logo-ul iese stricat | modelele video nu scriu bine text | **nu** genera text în video; pune textul și logo-ul în montaj (CapCut, DaVinci) |
| Mâncarea arată de plastic | lumină plată, fără textură | `backlight to reveal steam`, `glistening`, `visible crumb texture`, `macro 100mm`; evită `perfect`, `flawless` |
| Oamenii arată „AI” (piele de ceară) | fără indicații de textură | `natural skin texture, visible pores, no smoothing`; lumină naturală; acțiuni simple |
| Mâini ciudate | acțiuni complexe cu degetele | încadrare care evită mâinile sau acțiuni simple (ține, pune jos) |
| Mișcarea e prea lentă sau „slow motion” nedorit | cuvinte ca `cinematic`, `slow` peste tot | `real-time speed`, `natural pace` |
| Dialogul în română sună greșit | modelul nu pronunță bine româna | fără dialog generat; voiceover separat + subtitrări |
| `nsfw` sau `ip_detected` | persoane reale, branduri, personaje | scoate numele de branduri (Fender, Gibson, Coca-Cola), celebritățile și personajele |
| `Unknown params` / `Invalid values` | flag greșit pentru modelul ales | `higgsfield model get <model>` și folosește doar ce e în schemă |
| `Session expired` | autentificare expirată | `higgsfield auth login` |

## Disciplina iterației

1. Schimbi **un lucru** pe încercare (mișcarea, lumina **sau** durata, nu toate).
2. Notezi fiecare încercare în registru (vezi skill-ul `agent-reclame-higgsfield`): prompt, model, cost, păstrat sau respins și de ce.
3. După 3–4 eșecuri pe același cadru: altă imagine de start, alt model sau cadru mai simplu.
4. Testezi la 480p sau 720p și faci finalul la 1080p doar după ce conceptul a trecut.
