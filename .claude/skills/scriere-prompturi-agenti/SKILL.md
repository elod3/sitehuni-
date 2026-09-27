---
name: scriere-prompturi-agenti
description: Scrie și îmbunătățește prompturi, system prompts și skill-uri (SKILL.md) pentru Claude și agenți AI. Include regulile oficiale Anthropic pentru prompting și pentru scrierea de skill-uri, șabloane de system prompt pentru agenți de business și metoda de testare. Se folosește când se construiește un agent nou pentru un client, se scrie sau se repară un skill, un CLAUDE.md sau un system prompt, ori când un agent nu se comportă cum trebuie.
---

# Scriere de prompturi și skill-uri pentru agenți

## Prompturi pentru Claude: regulile care contează

1. **Clar și direct.** Scrie promptul ca pentru un angajat foarte deștept, dar nou, care nu știe nimic despre afacere. Test: dacă un coleg ar fi confuz citindu-l, și modelul va fi.
2. **Explică de ce.** `Răspunsul e citit de un TTS, deci fără liste și simboluri` funcționează mai bine decât `NU folosi liste`. Modelul generalizează din motiv.
3. **Exemple (3–5), variate, în `<example>`.** Cea mai sigură metodă de a controla formatul și tonul. Variază-le, ca să nu copieze un tipar nedorit.
4. **Tag-uri XML pentru structură:** `<context>`, `<instructions>`, `<documents>`, `<example>`. Nume consecvente.
5. **Un rol într-o frază** în system prompt: „Ești agentul de producție al unei agenții de reclame…”.
6. **Spune ce să facă, nu ce să nu facă.** În loc de „nu folosi markdown” → „scrie în paragrafe de proză”.
7. **Stilul promptului influențează stilul răspunsului.** Un prompt plin de bullet-uri produce răspunsuri cu bullet-uri.
8. **Fără strigăt.** `CRITICAL`, `MUST`, `NEVER` cu majuscule fac modelele actuale prea rigide. Folosește ton normal plus motivul.
9. **Documentele lungi sus, întrebarea jos.** Cu date mari, pune datele primele și cererea la final.
10. **Acțiune explicită.** „Poți sugera…?” produce sugestii. „Schimbă…” produce schimbări. Spune clar dacă agentul trebuie să acționeze sau doar să propună.

## System prompt pentru un agent de business (șablon)

```markdown
You are <rol> for <afacere>, <ce face agentul în 1 frază>.

<context>
<cine sunt clienții, ce contează pentru afacere, de ce contează regulile>
</context>

<how_to_work>
<pașii sau principiile de lucru, cu motivul lor>
<ce unelte / skill-uri folosește și când>
</how_to_work>

<never_without_confirmation>
<acțiunile ireversibile sau vizibile public: trimis mesaje, publicat, plăți, șters>
</never_without_confirmation>

<output>
<cum arată un răspuns bun, descris pozitiv; eventual un <example>>
</output>
```

Exemplu complet: skill-ul `agent-reclame-higgsfield`, fișierul `reference/system-prompt-agent.md`.

## Pentru agenți cu unelte

- **Autonomie calibrată:** acțiunile locale și reversibile (citit, scris fișiere, generat drafturi) le face singur. Cele ireversibile sau publice (trimis email, postat, plătit, șters) le face doar cu confirmare. Enumeră-le explicit.
- **Fără ghicit:** „Dacă îți lipsește o informație, folosește unelte ca s-o găsești sau întreabă; nu inventa.” Pentru business asta e cea mai importantă regulă.
- **Starea pe disc:** la sarcini lungi, agentul ține progresul în fișiere (`progres.md`, registre CSV, git). Poate continua dintr-o sesiune nouă.
- **Verificare:** dă-i agentului o metodă să-și verifice munca (script, checklist, comparare cu referința).
- **Unelte în paralel:** „Dacă apelurile nu depind unele de altele, fă-le în paralel.”

## Skill-uri (SKILL.md): regulile oficiale

**Structura:**
```
nume-skill/
  SKILL.md          ← obligatoriu; sub 500 de rânduri
  reference/*.md    ← detalii încărcate doar când trebuie
  scripts/*.py      ← rulate, nu citite
```

**Frontmatter:**
- `name`: maxim 64 de caractere, doar litere mici, cifre și cratime; **fără** cuvintele „claude” și „anthropic”.
- `description`: maxim 1024 de caractere, **la persoana a treia**, spune **ce face** și **când se folosește**, cu cuvintele cheie pe care le-ar scrie omul. Descrierea decide dacă skill-ul se activează, deci e cea mai importantă parte.

**Conținut:**
- **Concis.** Modelul e deja deștept. Scrie doar ce nu știe: regulile afacerii, comenzile exacte, capcanele.
- **Grad de libertate potrivit:** text liber pentru decizii creative; comenzi exacte pentru operații fragile (cost, generare, deploy).
- **Progressive disclosure:** esențialul în SKILL.md, detaliile în `reference/`. Legăturile doar un nivel adânc (SKILL.md → fișier), nu fișier → fișier → fișier.
- Fișierele de referință de peste 100 de rânduri au un **cuprins** sus.
- **Checklist-uri** pentru fluxurile cu mulți pași; **bucle de verificare** (fă → verifică → repară → repetă).
- **Un default, nu 5 opțiuni.** „Folosește X; pentru cazul Y, folosește Z.”
- **Terminologie consecventă**: un singur termen pentru un lucru.
- **Fără informații cu dată** („până în august folosește…”). Se învechesc.
- Scripturile tratează singure erorile și au constantele explicate.

## Testarea (evaluări)

1. Rulează sarcina **fără** skill și notează unde greșește modelul.
2. Scrie 3 scenarii de test din greșelile acelea (cerere + comportamentul așteptat).
3. Scrie skill-ul minim care le rezolvă.
4. Testează cu o sesiune nouă (Claude „B”), observă ce ratează și corectează cu sesiunea de lucru (Claude „A”).
5. Testează pe toate modelele pe care le vei folosi. Un model mic (Haiku) are nevoie de mai multe detalii decât unul mare.

Exemplu de scenariu:
```json
{
  "skills": ["reclame-brutarie"],
  "query": "Fă-mi un reel pentru croissantul cu fistic, am poza în input/",
  "expected_behavior": [
    "Folosește poza reală ca referință, nu generează un croissant generic",
    "Estimează costul înainte de generare",
    "Nu inventează ingrediente sau prețuri",
    "Livrează 9:16 cu hook în primele 2 secunde"
  ]
}
```

## Când agentul nu se comportă bine

| Simptom | Reparație |
|---|---|
| Skill-ul nu se activează | descrierea nu conține cuvintele pe care le scrie omul; adaugă-le |
| Ignoră o regulă | e îngropată la mijloc; mut-o sus sau în checklist și explică de ce contează |
| Aplică o regulă prea rigid | scoate majusculele și „CRITICAL”; adaugă motivul și excepția |
| Inventează date | „folosește doar faptele din brief.md; dacă lipsește ceva, întreabă” |
| Întreabă prea mult | listează explicit ce poate face singur |
| Face prea mult (fișiere, extra) | „fă doar ce s-a cerut; păstrează soluția simplă” |
| Răspunsuri prea lungi | descrie formatul exact dorit + un exemplu scurt |
