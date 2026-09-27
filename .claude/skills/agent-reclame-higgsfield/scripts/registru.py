#!/usr/bin/env python3
"""Registrul generărilor: fiecare încercare într-un CSV, ca să știi ce a mers
și câte credite a consumat fiecare client (pentru facturare).

Exemple:
  registru.py add --client arcadian --proiect reel-o-zi --cadru 1 \
      --model seedance_2_5 --prompt "Slow lateral tracking..." \
      --credite 70 --job <job_id> --url <result_url>
  registru.py status <job_id> pastrat
  registru.py status <job_id> respins --motiv "fereastra mutata"
  registru.py sumar                 # credite și rată de păstrare pe client
  registru.py sumar --luna 2026-10  # doar o lună (pentru factura lunară)
"""
import argparse
import csv
import os
import sys
from collections import defaultdict
from datetime import datetime

CAMPURI = ["data", "client", "proiect", "cadru", "model", "parametri",
           "prompt", "credite", "job", "url", "status", "motiv"]
# Registrul stă în folderul de lucru, lângă materialele clientului;
# se poate muta cu variabila de mediu REGISTRU.
CALE = os.environ.get("REGISTRU", "registru-generari.csv")


def citeste():
    if not os.path.exists(CALE):
        return []
    with open(CALE, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def scrie(randuri):
    with open(CALE, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=CAMPURI)
        w.writeheader()
        w.writerows(randuri)


def add(a):
    randuri = citeste()
    randuri.append({
        "data": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "client": a.client, "proiect": a.proiect, "cadru": a.cadru,
        "model": a.model, "parametri": a.parametri, "prompt": a.prompt,
        "credite": a.credite, "job": a.job, "url": a.url,
        "status": "de-verificat", "motiv": "",
    })
    scrie(randuri)
    print(f"Adăugat în {CALE} ({len(randuri)} rânduri).")


def status(a):
    randuri = citeste()
    gasit = [r for r in randuri if r["job"] == a.job]
    if not gasit:
        joburi = ", ".join(r["job"] for r in randuri[-5:]) or "niciunul"
        sys.exit(f"Jobul {a.job} nu e în registru. Ultimele joburi: {joburi}")
    for r in gasit:
        r["status"] = a.status
        r["motiv"] = a.motiv
    scrie(randuri)
    print(f"{a.job}: {a.status}")


def sumar(a):
    randuri = [r for r in citeste() if not a.luna or r["data"].startswith(a.luna)]
    if not randuri:
        print("Registru gol pentru perioada aleasă.")
        return
    per_client = defaultdict(lambda: {"credite": 0.0, "total": 0, "pastrate": 0})
    for r in randuri:
        c = per_client[r["client"]]
        try:
            c["credite"] += float(r["credite"] or 0)
        except ValueError:
            pass
        c["total"] += 1
        c["pastrate"] += r["status"] == "pastrat"
    print(f"{'client':<20}{'generări':>10}{'păstrate':>10}{'rată':>8}{'credite':>10}")
    for nume, c in sorted(per_client.items()):
        rata = c["pastrate"] / c["total"] * 100
        print(f"{nume:<20}{c['total']:>10}{c['pastrate']:>10}{rata:>7.0f}%{c['credite']:>10.0f}")


p = argparse.ArgumentParser(description="Registrul generărilor Higgsfield")
sub = p.add_subparsers(dest="cmd", required=True)

pa = sub.add_parser("add")
pa.add_argument("--client", required=True)
pa.add_argument("--proiect", required=True)
pa.add_argument("--cadru", default="")
pa.add_argument("--model", required=True)
pa.add_argument("--parametri", default="")
pa.add_argument("--prompt", required=True)
pa.add_argument("--credite", default="")
pa.add_argument("--job", default="")
pa.add_argument("--url", default="")
pa.set_defaults(fn=add)

ps = sub.add_parser("status")
ps.add_argument("job")
ps.add_argument("status", choices=["pastrat", "respins", "de-verificat"])
ps.add_argument("--motiv", default="")
ps.set_defaults(fn=status)

pr = sub.add_parser("sumar")
pr.add_argument("--luna", default="", help="format AAAA-LL")
pr.set_defaults(fn=sumar)

args = p.parse_args()
args.fn(args)
