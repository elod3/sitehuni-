#!/usr/bin/env python3
"""Mărimea poziției dintr-un risc fix, plus verificările care te scapă de lichidare.

  dimensionare.py --capital 1000 --risc 0.5 --intrare 30.00 --stop 29.40
  dimensionare.py --capital 1000 --risc 0.5 --intrare 30 --stop 29.4 --levier 5 --comision 0.05 --slippage 0.02

Pentru futures liniare (USDT-margined) în mod isolated. Prețul de lichidare e o
aproximare (formula exactă diferă pe bursă și pe treaptă de risc); scriptul lasă
marjă de siguranță și cere ca stopul să fie mult înainte de lichidare.

  --risc       % din capital pierdut dacă atinge stopul (0.5 = 0,5%)
  --comision   % per parte (taker Binance futures ≈ 0.05; maker ≈ 0.02)
  --slippage   % estimat per parte la stop (ordin la piață)
  --mmr        rata de marjă de întreținere, % (≈ 0.5 la treptele mici pe majoritatea burselor)
  --pas        pasul minim de cantitate al contractului (rotunjire în jos)
"""
import argparse
import math
import sys


def main():
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("--capital", type=float, required=True)
    p.add_argument("--risc", type=float, required=True, help="%% din capital")
    p.add_argument("--intrare", type=float, required=True)
    p.add_argument("--stop", type=float, required=True)
    p.add_argument("--levier", type=float, default=1.0)
    p.add_argument("--comision", type=float, default=0.05)
    p.add_argument("--slippage", type=float, default=0.02)
    p.add_argument("--mmr", type=float, default=0.5)
    p.add_argument("--pas", type=float, default=0.0)
    a = p.parse_args()

    if a.intrare <= 0 or a.stop <= 0 or a.capital <= 0 or a.levier < 1:
        sys.exit("Capitalul, prețurile trebuie să fie pozitive și levierul ≥ 1.")
    if a.risc > 2:
        print(f"⚠ Risc de {a.risc}% pe trade e mare. 10 pierderi la rând (se întâmplă) = "
              f"−{(1 - (1 - a.risc / 100) ** 10):.0%} din cont.")
    long = a.stop < a.intrare
    dist = abs(a.intrare - a.stop)
    if dist == 0:
        sys.exit("Stopul e egal cu intrarea.")

    # Costul real al unui stop atins: distanța + comision pe ambele părți + slippage la ieșire.
    cost_unit = a.intrare * a.comision / 100 + a.stop * (a.comision + a.slippage) / 100
    pierdere_unit = dist + cost_unit
    risc_bani = a.capital * a.risc / 100
    cant = risc_bani / pierdere_unit
    if a.pas > 0:
        cant = math.floor(cant / a.pas) * a.pas
    if cant <= 0:
        sys.exit("Cantitatea iese zero după rotunjire: capital prea mic pentru stopul ăsta.")

    notional = cant * a.intrare
    marja = notional / a.levier
    mmr = a.mmr / 100
    if long:
        lichidare = a.intrare * (1 - 1 / a.levier + mmr) if a.levier > 1 else 0.0
        spatiu = (a.stop - lichidare) / dist if lichidare else float("inf")
    else:
        lichidare = a.intrare * (1 + 1 / a.levier - mmr) if a.levier > 1 else float("inf")
        spatiu = (lichidare - a.stop) / dist if math.isfinite(lichidare) else float("inf")

    print(f"Direcție: {'LONG' if long else 'SHORT'}   distanța stop: {dist:.6g} ({dist / a.intrare:.2%})")
    print(f"Cantitate: {cant:.6g}   notional: {notional:,.2f}   marjă (x{a.levier:g}): {marja:,.2f}")
    print(f"Pierdere la stop, cu costuri: {cant * pierdere_unit:,.2f} ({cant * pierdere_unit / a.capital:.2%} din capital)")
    print(f"Costurile mănâncă {cost_unit / dist:.0%} din R la fiecare stop "
          f"(comision {a.comision}%×2 + slippage {a.slippage}%)")
    if a.levier > 1:
        print(f"Lichidare aprox.: {lichidare:.6g}")

    probleme = []
    if marja > a.capital:
        probleme.append(f"marja ({marja:,.2f}) depășește capitalul; mărește levierul sau lărgește stopul")
    if a.levier > 1 and spatiu < 1.0:
        probleme.append("stopul e DUPĂ prețul de lichidare: ai fi lichidat înainte de stop")
    elif a.levier > 1 and spatiu < 2.0:
        probleme.append("lichidarea e prea aproape de stop (sub 2× distanța stopului); scade levierul")
    if cost_unit / dist > 0.25:
        probleme.append("costurile depășesc 25% din R: stopul e prea strâns pentru instrument")
    if notional > a.capital * 3:
        probleme.append(f"expunere {notional / a.capital:.1f}× capitalul; verifică limita de expunere totală")
    print("\n" + ("✅ OK" if not probleme else "❌ " + "\n❌ ".join(probleme)))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
