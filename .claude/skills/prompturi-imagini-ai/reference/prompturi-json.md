# Prompturi în JSON: ce sunt și când merită

## Ce e

În loc de un paragraf, scrii promptul ca o fișă cu câmpuri:

```json
{
  "scena": "rustic bakery counter, early morning",
  "subiect": "sourdough loaf, cracked golden crust",
  "lumina": "soft window light from the left, backlit steam",
  "camera": "50mm, 45-degree angle, shallow depth of field",
  "stil": "commercial food photograph, warm natural color",
  "scop": "Instagram feed ad, 4:5"
}
```

A devenit popular pe social media cu Veo 3 și Nano Banana („JSON prompts îți dau control total”). Se vând chiar pachete de „100 prompturi JSON”.

## Chiar e mai bun?

**Pentru model, nu în mod special.** La teste A/B (același conținut, o dată în JSON, o dată în proză, pe Nano Banana Pro) rezultatele au fost practic la fel. Diferențele au fost doar variația normală între generări. Motive:
- modelele de imagine și video au învățat din descrieri în limbaj natural (captions, alt text), nu din JSON;
- acoladele, ghilimelele și numele de câmpuri sunt token-uri fără informație vizuală;
- modelul citește JSON-ul tot ca text.

Ghidul oficial OpenAI pentru GPT Image spune același lucru: JSON, proză sau instrucțiuni merg toate, **dacă intenția e clară**.

**Ce face JSON-ul să pară magic:** te obligă să completezi *toate* câmpurile (lumină, cameră, stil, ce rămâne fix). Un prompt complet bate unul vag, indiferent de format. Câștigul vine din **structură și completitudine**, nu din acolade.

## Când folosești JSON (și merită)

1. **Ca șablon pentru tine și pentru agent.** Fiecare client are o fișă JSON cu `style_lock`, `pastreaza` și `scop` fixe. Schimbi doar `subiect` sau `actiune`. Rezultatele rămân consecvente.
2. **Pentru variante A/B.** Schimbi **un singur câmp** (de exemplu doar `lumina`) și generezi 3 variante. Afli exact ce a făcut diferența.
3. **Pentru automatizare.** Agentul generează, salvează și modifică fișele programatic. Registrul rămâne ordonat.
4. **Storyboard-uri multi-shot.** O listă de cadre, fiecare cu câmpurile lui, e mai ușor de editat decât un paragraf lung.

## Cum le folosești corect

**Păstrezi fișa în JSON, trimiți modelului proza.** Scriptul face conversia în ordinea bună:

```bash
S=~/.claude/skills/prompturi-imagini-ai/scripts/din_json.py
python3 $S fisa.json              # un prompt text, gata de trimis
python3 $S fisa.json --variante   # câte un prompt pentru fiecare variantă
```

Fișă completă cu variante:

```json
{
  "format": "8s, 9:16, single continuous shot",
  "subiect": "a fresh sourdough loaf on a wooden peel",
  "actiune": "pulled from a stone oven, steam rising from the crust",
  "scena": "small artisan bakery at dawn, flour dust in the air",
  "lumina": "warm oven glow from the right, soft blue window light from the left",
  "camera": "slow dolly in toward the loaf, smooth gimbal, no zoom",
  "stil": "shot on 35mm, subtle film grain",
  "audio": "crackle of the cooling crust, quiet room tone, no music",
  "pastreaza": "the loaf shape and scoring pattern",
  "variante": {
    "lumina": [
      "warm oven glow from the right, soft blue window light from the left",
      "single warm side light, dark background, backlit steam",
      "bright soft morning daylight, airy and clean"
    ]
  }
}
```

Dacă vrei totuși să trimiți JSON direct (unele modele, precum GPT Image, îl acceptă fără probleme), păstrează valorile ca **fraze descriptive**, nu cuvinte cheie izolate. `"lumina": "soft window light from the left"` e bine; `"lumina": "soft"` nu spune nimic.
