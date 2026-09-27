# Claude Code pe laptop (Arch)

Toate setările de mai jos merg în `~/.claude/settings.json` (pentru toate proiectele) sau în `.claude/settings.json` (pentru un proiect). Fișierul e JSON strict: fără comentarii și fără virgulă la final. După salvare, `/status` arată dacă s-a încărcat.

## Cuprins
- 1. Permisiuni: secretele nu se citesc
- 2. Sandbox: izolare la nivel de sistem
- 3. Hook: scanarea automată a conținutului citit
- 4. MCP și skill-uri străine
- 5. Obiceiuri

## 1. Permisiuni

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)",
      "Read(~/.config/gh/**)"
    ]
  }
}
```

Atenție: regulile `deny` blochează doar uneltele Claude (Read, Edit), **nu** comenzile bash. `cat .env` le ocolește. De aceea ai nevoie și de sandbox.

Nu folosi `--dangerously-skip-permissions` când Claude citește conținut străin (web, repo-uri străine, emailuri). Fără permisiuni, o injecție reușită poate executa orice.

## 2. Sandbox

Pe Arch: `sudo pacman -S bubblewrap socat`, apoi în Claude Code rulezi `/sandbox` (tab-ul Dependencies arată ce lipsește).

```json
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "denyRead": ["~/.ssh", "~/.aws", "~/**/.env"]
    },
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org", "registry.npmjs.org", "*.higgsfield.ai"]
    }
  }
}
```

- `denyRead` e aplicat de sistemul de operare, deci blochează și `cat`, `python` etc.
- `allowedDomains` limitează unde pot trimite date comenzile. Asta închide canalul de exfiltrare prin `curl`. Adaugă domeniile de care ai nevoie; restul cer aprobare.
- Documentația completă: https://code.claude.com/docs/en/sandboxing

## 3. Hook: scanarea automată

Scannerul rulează automat după fiecare pagină web citită și după fiecare rezultat de unealtă MCP. Dacă găsește semne de injecție, îi trimite lui Claude un avertisment (nu blochează nimic):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "WebFetch|WebSearch|mcp__.*",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/skills/aparare-prompt-injection/scripts/scan_injectie.py --hook"
          }
        ]
      }
    ]
  }
}
```

Poți adăuga `Read` în `matcher` dacă lucrezi des cu fișiere străine (repo-uri clonate, PDF-uri de la clienți). O să vezi ocazional alarme false pe documentații despre securitate.

Testare după configurare: îi ceri lui Claude să citească o pagină sau un fișier de test din `reference/teste.md` și verifici că apare avertismentul.

## 4. MCP și skill-uri străine

- **Instalează doar servere MCP pe care le înțelegi.** Citește descrierile uneltelor (`/mcp` în Claude Code). Descrierea uneia poate conține instrucțiuni ascunse (tool poisoning). Trece-o prin scanner: caracterele Unicode invizibile nu se văd în editor.
- **Nu combina** un MCP care citește conținut nesigur (web, email) cu unul care are acces la date private și unul care trimite în exterior, în aceeași sesiune (trifecta).
- Un server MCP aprobat își poate schimba descrierile mai târziu (rug pull). Preferă versiuni fixate și verifică după update-uri.
- `.mcp.json` din repo-urile clonate de la alții nu se aprobă automat. Nu activa `enableAllProjectMcpServers`.
- **Skill-uri de la alții** (inclusiv de pe GitHub sau din marketplace-uri): citește SKILL.md și **toate** scripturile înainte de instalare. Rulează scannerul pe folder:
  ```bash
  find skill-strain/ -type f \( -name '*.md' -o -name '*.py' -o -name '*.sh' -o -name '*.json' \) -exec python3 ~/.claude/skills/aparare-prompt-injection/scripts/scan_injectie.py {} +
  ```
- Un `CLAUDE.md` dintr-un repo străin e tot conținut străin. Citește-l înainte să lucrezi în repo.

## 5. Obiceiuri

- Pentru sarcini care citesc mult web sau repo-uri străine, lucrează într-un folder sau container fără secrete (sau într-o sesiune în cloud, cum e asta).
- Nu ține tokenuri cu drepturi mari în variabile de mediu globale. Folosește tokenuri cu scop mic, pe proiect.
- Dacă Claude spune că a găsit o injecție, uită-te la sursă. De multe ori îți arată un site sau un repo compromis.
- Pentru `git push`, publicare, trimis mesaje: lasă-le pe „ask”, nu în `allow`.
