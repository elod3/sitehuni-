---
name: agent-reclame-higgsfield
description: Fluxul complet al agentului de reclame AI care lucrează cu Higgsfield CLI pentru clienții agenției (imobiliare, brutărie, magazin de muzică). De la brief, concepte și storyboard la estimare de cost, generare, verificare calitate, registru de generări și livrare. Se folosește când se produce o reclamă, un pachet lunar de conținut sau o campanie cap-coadă cu higgsfield, sau când se configurează agentul.
---

# Agent reclame Higgsfield

Agentul orchestrează. Skill-urile de nișă dau conținutul:
- prompturi: `prompturi-video-ai`, `prompturi-imagini-ai`
- nișe: `reclame-imobiliare`, `reclame-brutarie`, `reclame-magazin-muzica`
- execuție: skill-urile oficiale Higgsfield (`higgsfield-generate`, `higgsfield-product-photoshoot`, `higgsfield-soul-id`), instalate cu `npx skills add higgsfield-ai/skills`

## Pornire

```bash
which higgsfield || npm i -g @higgsfield/cli
higgsfield account status          # dacă zice "Session expired": higgsfield auth login (îl rulează omul)
higgsfield account                 # credite rămase
```

## Structura de foldere pe client

```
clienti/
  arcadian/
    brief.md            ← din reference/brief.md
    input/              ← randări, poze reale, logo, fonturi
    output/2026-10/     ← ce se livrează
    registru-generari.csv
  brutarie-X/
  muzica-Y/
```

Registrul se ține cu `scripts/registru.py` (rulat din folderul clientului).

## Flux (copiază checklist-ul și bifează)

```
- [ ] 1. Brief complet (reference/brief.md). Lipsește ceva esențial? Întreabă, o întrebare pe rând.
- [ ] 2. 3 concepte scurte (titlu + hook + 1 frază) → omul alege
- [ ] 3. Storyboard: cadru, secunde, sursă (randare / poză / T2V), model, prompt
- [ ] 4. Cost estimat: higgsfield generate cost … → total pe storyboard, confirmat de om dacă depășește bugetul
- [ ] 5. Test ieftin pe cel mai riscant cadru (720p sau turbo)
- [ ] 6. Generare finală
- [ ] 7. Registru: fiecare job adăugat (add), apoi marcat pastrat / respins cu motiv
- [ ] 8. QA (checklist-ul de mai jos) pe fiecare clip
- [ ] 9. Livrare: link-uri + ce trebuie pus în montaj (text, subtitrări, CTA, logo)
```

## Comenzi

```bash
# cost înainte
higgsfield generate cost seedance_2_5 --duration 8 --resolution 1080p

# generare (mereu --wait; --json când procesezi rezultatul)
higgsfield generate create seedance_2_5 --mode omni_reference \
  --start-image input/ext-fatada.png \
  --prompt "…" --duration 8 --resolution 1080p --aspect_ratio 9:16 --wait --json

# registru
python3 ~/.claude/skills/agent-reclame-higgsfield/scripts/registru.py add \
  --client arcadian --proiect reel-o-zi --cadru 1 --model seedance_2_5 \
  --parametri "8s 1080p 9:16" --prompt "…" --credite 70 --job <id> --url <url>
python3 …/registru.py status <id> respins --motiv "balcon in plus"
python3 …/registru.py sumar --luna 2026-10

# descărcare
curl -L -o output/2026-10/arcadian-reel-cadru1.mp4 "<url>"

# scor pe clipul final montat (opțional)
higgsfield generate create brain_activity --video output/2026-10/final.mp4 --wait
```

Nume de fișiere: `<client>-<proiect>-<cadru>-v<n>.<ext>`. Fără spații și fără diacritice.

## Reguli de buget

- Verifici **mereu** costul înainte de un lot. Nu porni generări în buclă fără limită.
- Maxim 4 încercări pe un cadru. Apoi schimbi abordarea și îl anunți pe om.
- Testele la rezoluție mică, finalul la 1080p.
- `registru.py sumar --luna …` la sfârșit de lună → creditele pe client. Costul lor intră în factura clientului.

## QA înainte de livrare

```
- [ ] Arhitectura sau produsul identic cu referința (ferestre, forme, logo, culori)
- [ ] Fără mâini deformate, fețe ciudate, text stricat
- [ ] Mișcarea e lină, fără sărituri sau „topiri”
- [ ] Primul cadru are mișcare din prima secundă
- [ ] Aspect ratio corect pe platformă
- [ ] Nicio afirmație care nu e în faptele verificate ale clientului
- [ ] Notă pentru om: marchează conținutul AI în Ads Manager; la imobiliare, Special Ad Category „Housing”
```

## Ce NU face agentul fără confirmarea omului

- Nu publică nimic pe conturile clientului.
- Nu cheltuie peste bugetul de credite stabilit.
- Nu inventează prețuri, oferte, termene sau ingrediente.
- Nu folosește fața unei persoane reale fără acordul ei (Soul ID doar cu poze și acord).

Pentru configurarea agentului (system prompt, reguli) vezi [reference/system-prompt-agent.md](reference/system-prompt-agent.md). Șablonul de brief: [reference/brief.md](reference/brief.md).
