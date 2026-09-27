#!/usr/bin/env python3
"""Verdict statistic pentru o serie de randamente (per trade sau per perioadă).

Răspunde la întrebarea „e edge sau noroc?” cu testele din metodologia proiectului:
t-stat, Sharpe, Probabilistic Sharpe Ratio (PSR), Deflated Sharpe Ratio (DSR,
corectat pentru câte variante ai încercat) și lungimea minimă a istoricului.

  statistici.py randamente.csv [--col ret] [--per-an 252] [--incercari 60] [--sr-std X]
  statistici.py randamente.csv --incercari 60 --sr-lista sharpe_variante.csv

CSV: o coloană numerică cu randamente (fracții: 0.01 = 1%, sau R-multipli per trade).
  --per-an     perioade pe an (252 zilnic, 52 săptămânal, 8760 orar cripto; la trade-uri: trade-uri/an)
  --incercari  câte variante / semnale / parametri ai testat ÎN TOTAL până la asta (pentru DSR)
  --sr-std     abaterea standard a Sharpe-urilor (per perioadă) între încercări; implicit
               eroarea standard sub ipoteza nulă, 1/sqrt(n)
  --sr-lista   CSV cu Sharpe-ul per perioadă al fiecărei încercări (înlocuiește --sr-std)

Formule: Bailey & López de Prado, „The Deflated Sharpe Ratio” (2014) și
„The Sharpe Ratio Efficient Frontier” (2012). Doar biblioteca standard Python.
"""
import argparse
import csv
import math
import random
import statistics as st
import sys
from statistics import NormalDist

N01 = NormalDist()
EULER = 0.5772156649015329


def citeste_coloana(cale, col):
    with open(cale, newline="", encoding="utf-8") as f:
        randuri = list(csv.reader(f))
    if not randuri:
        sys.exit(f"{cale} e gol.")
    antet = randuri[0]
    try:
        [float(x) for x in antet if x.strip()]
        antet, date = None, randuri          # fără antet
    except ValueError:
        date = randuri[1:]
    if antet:
        if col:
            if col not in antet:
                sys.exit(f"Coloana „{col}” nu există. Coloane: {', '.join(antet)}")
            idx = antet.index(col)
        else:
            # Ghicitul greșit (de exemplu o coloană de index) ar da un „edge” fals,
            # deci alegem doar după nume sau când există o singură coloană numerică.
            nume = [c.strip().lower() for c in antet]
            cunoscute = [n for n in ("ret", "return", "returns", "randament", "pnl", "r", "profit") if n in nume]
            numerice = [i for i, v in enumerate(date[0]) if _numar(v) is not None]
            if cunoscute:
                idx = nume.index(cunoscute[0])
            elif len(numerice) == 1:
                idx = numerice[0]
            else:
                sys.exit(f"Nu știu ce coloană e randamentul. Coloane: {', '.join(antet)}. Folosește --col.")
    else:
        idx = 0
    valori = [_numar(r[idx]) for r in date if len(r) > idx]
    return [v for v in valori if v is not None]


def _numar(s):
    try:
        v = float(s)
        return v if math.isfinite(v) else None
    except (ValueError, TypeError):
        return None


def momente(x):
    n, m = len(x), st.fmean(x)
    s = st.pstdev(x)
    if s == 0:
        return m, 0.0, 0.0, 3.0
    skew = sum((v - m) ** 3 for v in x) / n / s ** 3
    kurt = sum((v - m) ** 4 for v in x) / n / s ** 4   # kurtosis normală = 3
    return m, st.stdev(x), skew, kurt


def psr(sr, sr_ref, n, skew, kurt):
    """Probabilitatea ca Sharpe-ul adevărat să fie peste sr_ref (per perioadă)."""
    numitor = 1 - skew * sr + (kurt - 1) / 4 * sr ** 2
    if numitor <= 0 or n < 2:
        return float("nan")
    return N01.cdf((sr - sr_ref) * math.sqrt(n - 1) / math.sqrt(numitor))


def sr_asteptat_maxim(sr_std, incercari):
    """Sharpe-ul maxim la care te aștepți din NOROC după `incercari` variante fără edge."""
    if incercari <= 1:
        return 0.0
    return sr_std * ((1 - EULER) * N01.inv_cdf(1 - 1 / incercari)
                     + EULER * N01.inv_cdf(1 - 1 / (incercari * math.e)))


def min_trl(sr, sr_ref, skew, kurt, alfa=0.05):
    """Câte perioade îți trebuie ca să fii sigur (1-alfa) că SR > sr_ref."""
    if sr <= sr_ref:
        return float("inf")
    return 1 + (1 - skew * sr + (kurt - 1) / 4 * sr ** 2) * (N01.inv_cdf(1 - alfa) / (sr - sr_ref)) ** 2


def test_semne(x, repetari=5000, seed=7):
    """Permutare de semn: cât de des dă un semn aleator o medie cel puțin la fel de mare."""
    rnd = random.Random(seed)
    real = st.fmean(x)
    peste = sum(st.fmean([v if rnd.random() < 0.5 else -v for v in x]) >= real for _ in range(repetari))
    return (peste + 1) / (repetari + 1)


def main():
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("csv")
    p.add_argument("--col", default="")
    p.add_argument("--per-an", type=float, default=252)
    p.add_argument("--incercari", type=int, default=1)
    p.add_argument("--sr-std", type=float, default=None)
    p.add_argument("--sr-lista", default="")
    a = p.parse_args()

    x = citeste_coloana(a.csv, a.col)
    n = len(x)
    if n < 10:
        sys.exit(f"Doar {n} valori. Sub ~100 de observații nu trage concluzii.")
    m, s, skew, kurt = momente(x)
    sr = m / s if s else 0.0
    t = sr * math.sqrt(n)

    if a.sr_lista:
        lista = citeste_coloana(a.sr_lista, "")
        sr_std = st.stdev(lista) if len(lista) > 1 else 1 / math.sqrt(n)
        incercari = max(a.incercari, len(lista))
    else:
        sr_std = a.sr_std if a.sr_std is not None else 1 / math.sqrt(n)
        incercari = a.incercari
    prag = sr_asteptat_maxim(sr_std, incercari)
    p_psr = psr(sr, 0.0, n, skew, kurt)
    p_dsr = psr(sr, prag, n, skew, kurt)
    trl = min_trl(sr, prag, skew, kurt)
    p_semn = test_semne(x)
    ann = math.sqrt(a.per_an)
    castig = [v for v in x if v > 0]
    pierd = [v for v in x if v < 0]
    pf = sum(castig) / -sum(pierd) if pierd else float("inf")

    print(f"n = {n}   medie = {m:.5f}   PF = {pf:.2f}   win rate = {len(castig) / n:.0%}")
    print(f"Sharpe per perioadă = {sr:.4f}   anualizat = {sr * ann:.2f}   t = {t:.2f}")
    print(f"asimetrie = {skew:.2f}   kurtosis = {kurt:.2f} (normal = 3)")
    print(f"PSR  P(Sharpe real > 0)                  = {p_psr:.1%}")
    print(f"DSR  P(Sharpe real > norocul a {incercari} încercări) = {p_dsr:.1%}"
          f"   (prag noroc: {prag * ann:.2f} anualizat)")
    print(f"test permutare semne: p = {p_semn:.4f}")
    print(f"istoric minim necesar (95%, peste prag) = "
          + ("∞ (Sharpe sub prag)" if math.isinf(trl) else f"{math.ceil(trl)} perioade; ai {n}"))

    motive = []
    if n < 100:
        motive.append("sub 100 de observații")
    if abs(t) <= 3:
        motive.append("|t| ≤ 3")
    if not p_dsr > 0.95:
        motive.append("DSR ≤ 95% (poate fi norocul încercărilor)")
    if p_semn > 0.01:
        motive.append("permutarea nu respinge norocul la 1%")
    print("\nVERDICT: " + ("✅ trece pragurile proiectului. Urmează OOS, walk-forward și costuri reale."
                          if not motive else "❌ nedovedit: " + "; ".join(motive)))


if __name__ == "__main__":
    main()
