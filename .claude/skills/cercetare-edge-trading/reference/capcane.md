# Capcanele backtestului

## Cuprins
- Informație din viitor (lookahead, repainting)
- Date
- Costuri și execuție
- Statistică (overfitting, testare multiplă, perioade)
- Piață (drift, regimuri)
- Lista de verificare înainte să crezi un rezultat

## Informație din viitor

| Capcană | Cum apare | Cum o prinzi |
|---|---|---|
| Lookahead | semnalul folosește close-ul barei curente, dar intră la open-ul aceleiași bare; indicatori calculați pe toată seria (normalizare, z-score pe tot istoricul) | intrarea e la bara **următoare** după semnal; statisticile doar pe fereastra trecută (`rolling`), niciodată pe toată seria |
| Timeframe superior | H4 citit pe H1 înainte ca bara H4 să se închidă | folosești doar bara HTF **închisă** (`shift(1)` după resample; în Pine `lookahead_off` + `[1]`) |
| Repainting | pivoți, ZigZag, fractali confirmați abia după N bare, dar semnalul apare „la vârf” | semnalul apare abia la bara de confirmare; verifici că semnalele istorice nu se schimbă la rerulare pe date trunchiate |
| `calc_on_every_tick` / bar magnifier | Pine umflă rezultatele pe istoric | nu te bazezi pe TradingView; engine propriu |
| SL și TP în aceeași bară | nu știi ce s-a atins primul | presupune cazul **prost** (SL primul) sau folosește un TF mai mic pentru bara aia |
| LLM în backtest | modelul „știe” prețurile din datele de antrenament | niciun LLM nu ia decizii în backtest pe perioade dinaintea cutoff-ului lui (vezi skill-ul `agent-trading`) |

## Date

- **Survivorship bias:** listele de acțiuni de azi conțin doar supraviețuitorii. De asta proiectul sare peste acțiunile Nasdaq din MT5. La cripto: monedele delistate lipsesc din Binance, deci „altcoins” e un univers deja filtrat pe câștigători.
- **Fus orar:** MT5 e în ora serverului (UTC+2/+3), Binance în UTC. Contează la sesiuni și la bare zilnice.
- **Ordinea câmpurilor:** Dukascopy `.bi5` zilnic e (timp, **open, close, low, high**, volum), nu OHLC.
- **Serii scurte:** TSLA și UK100 aveau sub un an; intră în medii cu 20–30 de trade-uri și le strică. Exclude-le.
- **Verificări obligatorii:** NaN, timestamp-uri duplicate, bare OHLC invalide (high < low), serii identice (hash pe close), prețuri-reper cunoscute (BTC vârf nov 2021 ≈ 69k).
- **Anul curent** lipsește la Dukascopy zilnic (fișierul anual apare la final de an).
- **Feed-uri diferite dau rezultate diferite** (OANDA vs broker vs Dukascopy). Testezi pe feed-ul pe care vei tranzacționa.

## Costuri și execuție

- Spread real per bară, nu constant. La aur: 0,12$ la broker vs 0,66$ pe feed-ul Dukascopy retail.
- Comisioane reale: Binance spot 0,1% per parte; futures taker ~0,05%, maker ~0,02% (verifică nivelul tău).
- **Slippage asimetric:** stopul e ordin la piață (plătește slippage), TP-ul limit nu.
- Funding pe futures perpetue (se plătește sau se încasează la câteva ore; contează la ținute lungi).
- Ordinele limit nu se umplu garantat. La semnale de momentum, exact trade-urile bune fug fără tine. Măsoară rata de umplere.
- Filtre în „ticks” nu se compară între instrumente. Folosește bps sau ATR.

## Statistică

- **Testare multiplă:** fiecare variantă încercată (parametru, filtru, instrument, timeframe) e un test. După 60 de teste, un t = 2,5 apare din noroc. Ține registrul de încercări și folosește DSR.
- **Overfitting:** multe reguli și parametri pe puține trade-uri. Regulă practică: cel puțin 10–20 de trade-uri per parametru liber.
- **Vârf vs platou:** dacă parametrul 20 dă PF 1,8, iar 18 și 22 dau 1,0, ai găsit zgomot. Un edge real arată un **platou**.
- **Selecția perioadei:** „merge din 2023” e alegerea perioadei. Include bear market (2022 la cripto).
- **Total vs IS/OOS:** GBPUSD avea PF bun pe total, dar IS 0,75 și OOS 3,18: noroc, nu edge.
- **Mediile ascund totul:** edge mediu ≈ cost mediu, dar pe grupe de instrumente unele sunt clar pe plus și altele clar pe minus.
- **Monte Carlo corect:** bootstrap pe blocuri (păstrează autocorelația) pentru drawdown; permutare (poziții mutate aleator în timp) pentru „aduce semnalul ceva?”.

## Piață

- **Drift:** semnalele doar-long moștenesc bull market-ul. Scazi driftul sau folosești semnale simetrice (long și short).
- **Regimuri:** trend vs range, volatilitate mare vs mică, bull vs bear. Raportezi pe regimuri, nu doar total.
- **Controlul „stai long cu vol targeting”:** dacă strategia nu-l bate, îți trebuie alt motiv să existe (de exemplu corelație negativă, ca overlay).
- **Capacitate:** un edge pe monede mici poate dispărea la mărimi mai mari (slippage). Testezi la mărimea reală.

## Înainte să crezi un rezultat

```
- [ ] Intrarea e la bara de după semnal; niciun calcul nu vede viitorul
- [ ] Date verificate (NaN, duplicate, OHLC, fus orar, prețuri-reper)
- [ ] Costuri reale: spread, comision, slippage asimetric, funding
- [ ] n ≥ 100 de trade-uri; IS și OOS ambele pozitive; OOS nevăzut la optimizare
- [ ] Bate driftul și controlul „long cu vol targeting”
- [ ] Platou de parametri, nu vârf
- [ ] |t| > 3, DSR > 95% cu numărul REAL de încercări
- [ ] Funcționează pe mai multe instrumente din aceeași clasă, nu pe unul singur
```
