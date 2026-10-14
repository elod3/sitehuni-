#!/usr/bin/env python3
"""Asamblează paginile statice din src/.

Fiecare pagină din src/pages/ primește același <head>, aceeași bară de sus, meniu, cortina
de tranziție și footer. Rulează `python3 build.py` după orice modificare în src/.
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"

# Adresa publică (canonical, og:url, og:image). Când DNS-ul pentru arcadianresidence.ro
# trimite spre GitHub Pages, devine "https://www.arcadianresidence.ro/" și se adaugă fișierul CNAME.
SITE = "https://elod3.github.io/sitehuni-/"

PAGES = {
    "index.html": {
        "title": "Arcadian Residence — apartamente nZEB în Ceuașu de Câmpie, Mureș",
        "desc": "Ansamblu rezidențial P+1E în Ceuașu de Câmpie, la 15 minute de Târgu Mureș. Apartamente de 71,3 m² și 122,26 m², standard nZEB, 40% spații verzi.",
        "page": "home", "nav": None, "bar": "dark", "preload": "assets/img/ext-fatada-1800.webp",
    },
    "ansamblu.html": {
        "title": "Ansamblul — Arcadian Residence",
        "desc": "Locație, masterplan și fișa tehnică: nZEB, tripan, încălzire în pardoseală, structură din beton și cărămidă, învelitoare din tablă fălțuită.",
        "page": "ansamblu", "nav": "ansamblu", "bar": "light", "preload": "assets/img/ext-alee-1800.webp",
    },
    "tip-1.html": {
        "title": "Apartament Tip 1 · 71,3 m² — Arcadian Residence",
        "desc": "Apartament de 71,3 m² cu living, dormitor, birou și acces direct din exterior. Plan interactiv cu suprafețele pe încăperi.",
        "page": "apt", "type": "t1", "nav": "tip-1", "bar": "light", "preload": "assets/img/t1-living-1800.webp",
    },
    "tip-2.html": {
        "title": "Apartament Tip 2 · 122,26 m² — Arcadian Residence",
        "desc": "Apartament de 4 camere, 122,26 m², balcon de 8,43 m², două dormitoare, birou și două băi. Plan interactiv cu suprafețele pe încăperi.",
        "page": "apt", "type": "t2", "nav": "tip-2", "bar": "light", "preload": "assets/img/t2-living-1800.webp",
    },
    "tur.html": {
        "title": "Tur 3D prin clădire — Arcadian Residence",
        "desc": "Plimbă-te prin modelul 3D al ansamblului Arcadian Residence: parter, scară și mansardă, cu mobila din proiect. WASD și mouse, sau degetele pe telefon.",
        "page": "tur", "nav": "tur", "bar": "dark", "preload": "assets/img/ext-fatada-1800.webp",
    },
    "contact.html": {
        "title": "Rezervare — Arcadian Residence",
        "desc": "Rezervă-ți apartamentul în Arcadian Residence. Tur virtual 3D cu echipa de vânzări: 0770 916 916, arcadianresidence@gmail.com.",
        "page": "contact", "nav": "contact", "bar": "dark", "preload": "assets/img/ext-calcan-1800.webp",
    },
}

NAV = [
    ("ansamblu", "ansamblu.html", "Ansamblul", "01"),
    ("tip-1", "tip-1.html", "Tip 1 · 71,3 m²", "02"),
    ("tip-2", "tip-2.html", "Tip 2 · 122,26 m²", "03"),
    ("tur", "tur.html", "Tur 3D", "04"),
    ("contact", "contact.html", "Rezervare", "05"),
]


def part(name):
    return (SRC / "partials" / name).read_text(encoding="utf-8")


def nav_links(current, cls):
    out = []
    for key, href, label, num in NAV:
        cur = ' aria-current="page"' if key == current else ""
        if cls == "menu":
            out.append(f'<li><a href="{href}"{cur} data-label="{label}"><span>{num}</span>{label}</a></li>')
        else:
            short = label.split(" · ")[0]
            out.append(f'<a href="{href}"{cur} data-label="{label}">{short}</a>')
    return "\n        ".join(out)


def build():
    for out, p in PAGES.items():
        body = (SRC / "pages" / out).read_text(encoding="utf-8")
        attrs = f'data-page="{p["page"]}" data-bar="{p["bar"]}"'
        if "type" in p:
            attrs += f' data-type="{p["type"]}"'
        html = (part("layout.html")
                .replace("{{site}}", SITE)
                .replace("{{file}}", "" if out == "index.html" else out)
                .replace("{{title}}", p["title"])
                .replace("{{desc}}", p["desc"])
                .replace("{{preload}}", p["preload"])
                .replace("{{body_attrs}}", attrs)
                .replace("{{loader}}", part("loader.html") if p["page"] == "home" else "")
                .replace("{{nav}}", nav_links(p["nav"], "bar"))
                .replace("{{menu}}", nav_links(p["nav"], "menu"))
                .replace("{{cta}}", "" if p["page"] == "contact" else part("cta.html"))
                .replace("{{main}}", body))
        (ROOT / out).write_text(html, encoding="utf-8")
        print("scris", out)


if __name__ == "__main__":
    build()
