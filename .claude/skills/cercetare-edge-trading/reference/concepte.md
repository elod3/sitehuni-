# Concepte clasice și ce spune literatura

Fiecare concept e o **familie de ipoteze** de testat pe datele tale, cu costurile tale. Faptul că a mers în lucrări academice (pe futures instituționale, cu costuri mici, pe decenii) nu garantează nimic pe alt-coins cu costuri de retail.

## Cuprins
- Trend following / time-series momentum
- Momentum cross-sectional
- Volatility targeting
- Mean reversion
- Carry și funding
- Analiză tehnică discreționară, SMC/ICT, pattern-uri
- Cărți de referință

## Trend following / time-series momentum

- **Ideea:** ce a crescut în ultimele 1–12 luni tinde să mai crească puțin. Pe futures diversificate, documentat pe peste un secol (Moskowitz, Ooi, Pedersen 2012; Hurst, Ooi, Pedersen 2017).
- **Caracteristici:** win rate mic (25–40%), câștiguri rare și mari, drawdown-uri lungi, performanță bună în crize prelungite (2008, 2022). Merge pe **portofoliu diversificat**, rar pe un singur instrument.
- **În proiect:** AHL multi-horizon a confirmat asta. Singur, e nedovedit (t < 1). Ca overlay: corelație −0,15 cu long-ul, DD tăiat de la −19,6% la −12,4%, −7% în 2022 când piața făcea −68%.
- **Capcană:** optimizarea lungimii mediilor mobile pe un instrument = overfitting clasic.

## Momentum cross-sectional

- **Ideea:** cumperi ce a crescut **cel mai mult față de celelalte**, vinzi ce a crescut cel mai puțin. Clasic la acțiuni (Jegadeesh și Titman 1993); la cripto, rezultate publicate pe orizonturi scurte (zile–săptămâni), cu risc mare de crash-uri de momentum.
- **Test:** ranking săptămânal pe universul de alt-coins, long top / short bottom, costuri incluse. Atenție la survivorship (monedele delistate lipsesc).

## Volatility targeting

- **Ideea:** mărimea poziției invers proporțională cu volatilitatea recentă. Nu creează edge, dar **stabilizează riscul** și poate îmbunătăți Sharpe-ul (Moreira și Muir 2017, rezultate dezbătute ulterior).
- **În proiect:** funcționează „ca la carte”. Ținta 10% dă o volatilitate realizată de 9–13% pe fiecare instrument.
- Se folosește peste orice strategie, ca strat de risc (vezi skill-ul `risc-si-dimensionare`).

## Mean reversion

- **Ideea:** după o mișcare extremă, prețul revine. Documentat la acțiuni pe orizonturi foarte scurte (zile) și în perechi cointegrate (pairs trading).
- **În proiect:** mort în toate variantele (RSI2, RSI14, z-score, bare consecutive), |t| < 1,7 pe cripto, indici și metale, pe H1.
- Dacă o carte promite mean reversion pe cripto intraday, testul e deja făcut: nu există la costurile tale. Excepție de testat separat: pairs sau spread-uri între active legate.

## Carry și funding

- **Carry:** câștigi diferența de dobândă sau de preț între termene (forex carry, contango/backwardation la futures).
- **Funding pe perpetue cripto:** când funding-ul e foarte pozitiv, longurile plătesc shorturile. Strategia „cash and carry” (spot long + perp short) încasează funding-ul, cu risc de piață neutru, dar cu risc de bursă, de lichidare pe partea de perp și de funding care se întoarce.
- E o sursă de randament de tip „primă de risc”, nu predicție. Se testează cu istoricul funding-ului, costurile de intrare/ieșire și riscul de lichidare.

## Analiză tehnică discreționară, SMC/ICT, pattern-uri

- Multe concepte (order blocks, FVG, lichiditate, kill zones, Wyckoff, Elliott, armonice) sunt **greu de definit mecanic**. Ce nu poți scrie ca regulă fără ambiguitate nu poți testa.
- Când le mecanizezi, de regulă rămân puține trade-uri și edge-ul dispare pe date lungi: **SMC Sniper**, PF 2,05 pe TradingView → 1,23 real → 0,317 pe H1 / 1,5 ani.
- Literatura (Aronson, *Evidence-Based Technical Analysis*) a testat sute de reguli tehnice clasice și aproape toate dispar după corecția pentru testare multiplă.
- Utile ca **ipoteze concrete**: „sweep de lichiditate urmat de displacement → continuare pe N bare” se poate scrie și scana cu `edge_scan.py`.

## Cărți de referință (pentru ipoteze și metodă)

| Carte | Autor | Pentru ce |
|---|---|---|
| *Evidence-Based Technical Analysis* | David Aronson | metoda științifică, testarea multiplă, de ce mor regulile tehnice |
| *Advances in Financial Machine Learning* | Marcos López de Prado | DSR, PBO, purging/embargo, etichetare cu triple barrier |
| *Systematic Trading* și *Leveraged Trading* | Robert Carver | vol targeting, dimensionare, portofolii de reguli simple, costuri |
| *Following the Trend* | Andreas Clenow | trend following diversificat pe futures |
| *Algorithmic Trading* | Ernest Chan | mean reversion, momentum, backtest practic |
| *Trading and Exchanges* | Larry Harris | microstructură: cine e de partea cealaltă și de ce |
| *Fooled by Randomness* | Nassim Taleb | noroc vs îndemânare, cozi groase |

Când ai cărțile, le treci prin skill-ul `carti-in-ipoteze`.
