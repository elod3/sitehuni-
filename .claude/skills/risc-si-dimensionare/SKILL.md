---
name: risc-si-dimensionare
description: Managementul riscului pentru strategii și boți de trading: mărimea poziției din risc fix, vol targeting, Kelly fracționat, limite de pierdere zilnică și de drawdown, expunere totală și corelații, levier, lichidare și funding pe futures cripto, risc de ruină. Include un calculator de poziție care verifică lichidarea și costurile. Se folosește la orice strategie înainte de live, la configurarea unui bot, când se alege levierul sau riscul per trade, sau când se analizează un drawdown.
---

# Risc și dimensionare

Edge-ul decide **dacă** câștigi pe termen lung. Riscul decide **dacă mai ești în joc** ca să vezi termenul lung. Un edge real cu risc prost tot duce contul la zero.

## Regulile de bază

1. **Riscul per trade e fix, în % din capital**, calculat la stop, **cu costuri incluse**. Default: **0,25–0,5%** cât timp strategia e nouă pe live; maximum 1%.
2. **Stopul se pune din piață** (ATR, structură), iar **cantitatea** rezultă din risc. Nu invers.
3. **Levierul e o consecință, nu o alegere.** Pe futures, levierul doar setează cât capital blochezi. Riscul real e dat de cantitate și de stop. Folosește levierul minim la care încape marja.
4. **Stopul trebuie să fie mult înainte de prețul de lichidare** (cel puțin 2× distanța stopului). Altfel te lichidează bursa înainte de stopul tău, cu taxă de lichidare.
5. **Limite automate** pe care botul le respectă singur (vezi mai jos).

## Calculatorul

```bash
python3 ~/.claude/skills/risc-si-dimensionare/scripts/dimensionare.py \
  --capital 1000 --risc 0.5 --intrare 30.00 --stop 29.40 --levier 5 --comision 0.05 --slippage 0.02
```

Îți dă cantitatea, notionalul, marja, pierderea reală la stop (cu comision și slippage), cât din R mănâncă costurile și prețul aproximativ de lichidare. Verifică și: stopul înainte de lichidare, costuri sub 25% din R, marja încape în capital, expunerea. Iese cu cod 1 dacă ceva e greșit, deci botul îl poate folosi ca poartă înainte de orice ordin.

## Cât de mult risc per trade

Probabilitatea unor serii lungi de pierderi e mai mare decât pare. La un win rate de 35% (tipic pentru trend following):

| Pierderi la rând | Probabilitatea să apară cel puțin o dată în 200 de trade-uri |
|---|---|
| 8 | 91% |
| 10 | 62% |
| 12 | 32% |
| 15 | 10% |
| 20 | 1% |

Cu 1% per trade, 15 pierderi = −14%. Cu 3% = −37%, iar de acolo îți trebuie +58% ca să revii. De asta **riscul mic** e default, mai ales la început.

**Kelly:** formula dă fracțiunea „optimă”, dar presupune că îți cunoști exact edge-ul. Nu-l cunoști, iar estimările din backtest sunt optimiste. Dacă o folosești, doar **¼ sau ½ Kelly**, și numai după sute de trade-uri live.

## Vol targeting (pentru strategii pe portofoliu)

```
poziție_notional = capital × (volatilitate_țintă_anuală / volatilitate_realizată_anuală_a_instrumentului)
```

- Volatilitatea realizată: deviația standard a randamentelor pe 20–60 de zile, anualizată.
- Ținta tipică: 10–20% anual per strategie. În `trading-bots` s-a verificat: ținta 10% dă realizat 9–13%.
- Plafonează levierul rezultat (de exemplu max 2–3×) pentru instrumentele cu volatilitate mică (PAXG), altfel formula cere poziții uriașe.

## Limite automate (kill switch pe risc)

| Limită | Default sugerat | Ce face botul |
|---|---|---|
| Pierdere zilnică | −2% | nu mai deschide nimic până a doua zi |
| Drawdown de la vârf | −10% | se oprește complet; revii tu, analizezi |
| Pierderi la rând | 8–10 | pauză și verificare (poate s-a schimbat regimul sau e un bug) |
| Expunere totală | 3× capital notional, 1 poziție per instrument | refuză ordinele noi |
| Corelație | alt-coins ≈ același pariu | tratează 4 alt-coins long ca o singură poziție mare |
| Abatere de la backtest | rezultatele live mult sub distribuția din backtest | pauză și investigație |

Limitele se verifică **în cod, înainte de fiecare ordin**, nu în prompt și nu „când își amintește agentul”.

## Specific futures cripto

- **Isolated margin**, nu cross: o poziție proastă nu trage după ea tot contul.
- **Funding:** la perpetue se plătește sau se încasează la câteva ore. La ținute de zile, poate mânca edge-ul. Include-l în backtest.
- **Lichidarea în wick-uri:** cripto face mișcări bruște de 5–10% în minute. Un stop la 2% cu levier 50× e lichidare garantată la primul wick.
- **Riscul de bursă:** nu ține tot capitalul pe bursă. Doar cât folosește botul.
- **ADL** (auto-deleveraging) pe mișcări extreme: poziția câștigătoare poate fi închisă forțat.

## Ce raportezi despre risc

Max drawdown (backtest și live), cea mai lungă perioadă sub vârf, cea mai lungă serie de pierderi, volatilitatea realizată față de țintă, expunerea maximă atinsă și de câte ori s-au declanșat limitele.
