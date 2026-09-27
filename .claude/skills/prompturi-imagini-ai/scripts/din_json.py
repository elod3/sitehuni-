#!/usr/bin/env python3
"""Transformă o fișă JSON de prompt în text (proză) în ordinea care merge la modele.

JSON-ul e bun pentru tine și pentru agent (șablon, variante, automatizare);
modelul primește proza, care e limbajul lui natural.

  din_json.py fisa.json            → un prompt
  din_json.py fisa.json --variante → câte un prompt pentru fiecare valoare din "variante"

Câmpuri recunoscute (toate opționale, ordinea de ieșire e fixă):
  format, subiect, actiune, scena, detalii, lumina, camera, stil,
  text_in_imagine, audio, pastreaza, scop, style_lock
"variante": {"camp": ["valoare A", "valoare B", ...]} schimbă un singur câmp (test A/B).
"""
import json
import sys

# Subiectul și acțiunea întâi: modelele video fixează subiectul din primele cuvinte
# (la imagini ordinea asta merge la fel de bine). Apoi locul, detaliile, fotografia,
# textul, constrângerile și scopul; style_lock la final, identic peste tot.
ORDINE = ["format", "subiect", "actiune", "scena", "detalii", "lumina", "camera",
          "stil", "text_in_imagine", "audio", "pastreaza", "scop", "style_lock"]
PREFIX = {"camera": "Camera: ", "audio": "Audio: ", "pastreaza": "Keep ",
          "text_in_imagine": "Text in image: "}


def fraza(camp, valoare):
    if isinstance(valoare, list):
        valoare = ", ".join(valoare)
    valoare = str(valoare).strip().rstrip(".")
    if not valoare:
        return ""
    prefix = PREFIX.get(camp, "")
    if camp == "pastreaza":
        if valoare.lower().startswith("keep"):
            prefix = ""
        else:
            valoare += " exactly as in the reference"
    fraza = prefix + valoare
    return fraza[0].upper() + fraza[1:] + "."


def proza(fisa):
    necunoscute = set(fisa) - set(ORDINE) - {"variante"}
    if necunoscute:
        print(f"Atenție: câmpuri ignorate: {', '.join(sorted(necunoscute))}. "
              f"Câmpuri valide: {', '.join(ORDINE)}", file=sys.stderr)
    return "\n".join(f for c in ORDINE if c in fisa and (f := fraza(c, fisa[c])))


if len(sys.argv) < 2:
    sys.exit(__doc__)
with open(sys.argv[1], encoding="utf-8") as f:
    fisa = json.load(f)

if "--variante" in sys.argv and fisa.get("variante"):
    for camp, valori in fisa["variante"].items():
        for i, v in enumerate(valori, 1):
            print(f"### Varianta {camp} {i}\n{proza({**fisa, camp: v})}\n")
else:
    print(proza(fisa))
