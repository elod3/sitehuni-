---
name: cercetare-edge-trading
description: Metodologia de cercetare pentru strategii de trading (cripto, indici, metale, forex): de la ipoteză la verdict statistic, fără să te păcălești singur. Edge scan înainte de strategie, baseline de drift, costuri reale, IS/OOS și walk-forward, pragul |t| > 3, Deflated Sharpe pentru testare multiplă, permutări, capcanele (lookahead, repainting, survivorship, TradingView, date) și un script de verdict. Se folosește când se testează, se validează sau se judecă o strategie, un semnal, un indicator, o idee dintr-o carte sau un rezultat de backtest, inclusiv în repo-ul trading-bots.
---

# Cercetare de edge în trading

Scopul: să afli **repede și ieftin** dacă o idee are informație reală, înainte să construiești ceva pe ea. Majoritatea ideilor nu au. Din ~20 de familii de semnale testate în `trading-bots`, una singură a supraviețuit. E normal, nu e un eșec.

## Regulile proiectului (câștigate din eșecuri)

1. **Întâi măsori dacă semnalul prezice, abia apoi construiești strategia.** (`edge_scan.py`)
2. **Testul „zero costuri”** separă „semnal slab” de „costuri mari”. Dacă la cost zero PF ≈ 1,00, semnalul e mort.
3. **Sub ~100 de trade-uri nu tragi concluzii.**
4. **Mereu IS vs OOS.** IS bun și OOS prost = zgomot.
5. **Prag |t| > 3, nu 2.** Testezi zeci de semnale; la 60 de teste, pragul Bonferroni e ~3,35.
6. **Compară mereu cu driftul pieței** („cumpără orice, oricând”). În bull market, orice semnal long pare bun.
7. **Cifrele TradingView nu sunt dovadă.** Doar backtesterul propriu, pe date de broker, cu costuri.
8. **Parametrii se îngheață înainte de OOS.** Dacă îi schimbi după ce ai văzut OOS-ul, OOS-ul a devenit IS.

## Fluxul (copiază și bifează)

```
- [ ] 1. Ipoteza scrisă: CE prezice, DE CE ar exista (cine pierde bani în partea cealaltă?), pe CE orizont
- [ ] 2. Registrul de încercări: adaug ipoteza în lista totală (numărul contează la DSR)
- [ ] 3. Edge scan: randamentul viitor după semnal, în ATR, long și short simetric, minus drift
- [ ] 4. Grup de control: un semnal știut mort trebuie să iasă ~0
- [ ] 5. Costuri: edge brut vs cost per round-trip, pe fiecare instrument (ATR% contează)
- [ ] 6. Doar dacă 3–5 trec: strategia în engine, cu spread + comision + slippage asimetric
- [ ] 7. Split IS/OOS cu regimuri diferite (ex. IS 2021–2023 cu bear, OOS 2024–2026); parametri înghețați
- [ ] 8. Walk-forward: re-optimizare pe ferestre rulante, rezultatele doar din porțiunile nevăzute
- [ ] 9. Verdict statistic: scripts/statistici.py (t, PSR, DSR, permutare, istoric minim)
- [ ] 10. Robustețe: grilă de parametri vecini (platou, nu vârf), alte instrumente, alte perioade
- [ ] 11. Raport scurt: concluzia sus, tabele, ce e mort și de ce
```

## Verdictul statistic

```bash
python3 ~/.claude/skills/cercetare-edge-trading/scripts/statistici.py trades.csv --col r --per-an 400 --incercari 60
```

- **t-stat** = Sharpe per perioadă × √n. Proiectul cere |t| > 3.
- **PSR**: probabilitatea ca Sharpe-ul adevărat să fie > 0, ajustată pentru asimetrie și cozi groase.
- **DSR (Deflated Sharpe)**: la fel, dar față de Sharpe-ul maxim pe care l-ai fi obținut **din noroc** după N încercări. `--incercari` = **toate** variantele încercate vreodată pe datele astea (semnale, parametri, filtre), nu doar ultima. Minți aici = te minți pe tine.
- **Permutare de semne**: cât de des ar da noroc pur o medie la fel de mare.
- **Istoric minim**: câte perioade îți trebuie ca rezultatul să fie credibil.

Trece doar dacă: n ≥ 100, |t| > 3, DSR > 95%, permutare p < 0,01. Chiar și atunci urmează OOS și live pe bani mici.

## Unitatea de măsură: ATR, nu dolari

Edge-ul și costurile se măsoară **în ATR** (sau în R). Așa se pot compara instrumente diferite. Din `EDGE_SCAN_REPORT.md`: variabila care decide profitul nu e semnalul, ci **ATR% raportat la cost**. PAXG avea cel mai mare edge brut (0,24 ATR) și cel mai prost net, pentru că ATR-ul lui e 0,27% și comisionul îl îngroapă.

Formula rapidă: `net = edge_ATR − (cost_round_trip_% / ATR_%)`.

## Capcane

Lista completă, cu cum le detectezi, e în [reference/capcane.md](reference/capcane.md): lookahead, repainting, survivorship, drift deghizat în edge, date proaste, fus orar, costuri lipsă, slippage simetric, overfitting prin mulți parametri, testare multiplă ascunsă, selecția perioadei.

## Ideile din cărți, cursuri, YouTube, Twitter

Sunt **ipoteze**, nu reguli. Fiecare trece prin fluxul de mai sus. Procesul de transformare a unei cărți în ipoteze testabile e în skill-ul `carti-in-ipoteze`. Pentru concepte clasice (trend following, momentum, mean reversion, carry, vol targeting) și ce spune literatura despre ele: [reference/concepte.md](reference/concepte.md).

## Ce e deja mort în `trading-bots` (nu repeta)

SMC Sniper (PF real 1,23 vs 2,05 TV; mort pe date lungi), TrendFollow (PF 1,000 la cost zero), mean reversion în toate variantele testate (|t| < 1,7), forexul la costurile de retail (spread 7–13% din ATR), sesiunile și volatilitatea ca semnal (erau drift). AHL multi-horizon: nedovedit singur, util ca overlay. Detalii în `CONTEXT_21_IUL.md` din repo.

Singurul supraviețuitor: **lumânare mare → continuare** (corp > 1,5×ATR, 6 bare H1), t = 4,98 pe 5,5 ani, profitabil doar pe alt-coins volatile pe futures.

## Formatul raportului

Concluzia sus, în 3–5 rânduri. Apoi tabele scurte (se citesc pe telefon). Cifrele cu n, t și IS/OOS lângă ele. La final: ce e mort și de ce, și următorul pas concret. Fără hype: „nedovedit” e un rezultat valid.
