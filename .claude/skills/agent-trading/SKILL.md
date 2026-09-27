---
name: agent-trading
description: Cum construiești și rulezi agenți AI de trading în siguranță: ce are voie să facă LLM-ul (cercetare, cod, backtest, rapoarte, monitorizare) și ce nu (să decidă trade-uri din știri sau intuiție), arhitectura cu motor determinist + agent, securitatea cheilor de bursă, trecerea backtest → paper → live mic → scalare, kill switch, reconciliere, monitorizare, apărarea contra prompt injection și impozitarea în România. Se folosește când se configurează un agent sau bot de trading, se pregătește o strategie pentru live, se conectează un API de bursă sau se analizează ce face un bot în producție.
---

# Agenți de trading

Folosește împreună cu `cercetare-edge-trading` (validarea strategiei), `risc-si-dimensionare` (limite și mărimea pozițiilor) și `aparare-prompt-injection` (conținut din afară).

## Principiul central

**LLM-ul nu e strategia.** Agentul AI e un cercetător și un operator foarte rapid: scrie cod, rulează backtest-uri, citește rezultate, scrie rapoarte, supraveghează botul. **Deciziile de trade le ia un motor determinist**, adică un cod cu reguli validate statistic, care face același lucru de fiecare dată.

De ce:
- **LLM-urile „știu” trecutul.** Au în datele de antrenament prețurile istorice și ce s-a întâmplat după. Un backtest în care un LLM decide trade-uri pe perioade dinaintea cutoff-ului lui e **contaminat de lookahead**. Studii din 2025–2026 arată că modelele reproduc prețuri istorice aproape exact. Iar când memoria e controlată, randamentele „agenților LLM de trading” se explică în mare parte prin expunerea la piață, cu dovezi slabe de alpha.
- **Nu sunt reproductibile.** Același input poate da decizii diferite. Nu poți valida statistic ceva ce nu se comportă la fel.
- **Sunt atacabile.** Un agent care citește știri sau Twitter și are acces la cont și la ordine are **trifecta letală** (conținut nesigur + date private + acțiune). Un tweet sau o pagină poate conține instrucțiuni.

## Arhitectura

```
┌─ AGENT (LLM, Claude Code) ─────────────────────┐   fără chei de trading
│ cercetare, cod, backtest, rapoarte,           │   citește web, cărți, date
│ propune modificări de strategie (ca PR/fișier)│
└───────────────┬───────────────────────────────┘
                │ omul aprobă (commit/merge, parametri înghețați)
┌───────────────▼───────────────────────────────┐   are cheia de trading
│ MOTOR DETERMINIST (Python)                     │   NU citește web/știri
│ date de piață → semnal → risc → ordine         │   limite hard în cod
│ kill switch, reconciliere, jurnal              │
└───────────────┬───────────────────────────────┘
                │ doar citire: jurnal, poziții, PnL
┌───────────────▼───────────────────────────────┐   cheie read-only
│ MONITOR (poate fi agentul)                     │   alerte, rapoarte zilnice,
│ compară live cu backtest, raportează           │   poate doar OPRI botul
└───────────────────────────────────────────────┘
```

Regula de aur (Rule of Two): **nicio componentă nu are simultan** conținut nesigur + cheie de trading + putere de a trimite ordine. Agentul care citește web-ul nu are cheia. Motorul care are cheia nu citește web-ul. Monitorul poate **opri** botul, dar nu poate deschide poziții.

## De la backtest la live (fazele)

```
- [ ] 1. Strategia a trecut fluxul din cercetare-edge-trading (OOS, |t|>3, DSR, costuri reale)
- [ ] 2. Motorul live folosește EXACT același cod de semnal ca backtestul (nu o rescriere)
- [ ] 3. Paper trading / testnet 2–4 săptămâni: semnalele live = semnalele din backtest pe aceleași bare?
- [ ] 4. Live cu bani mici (sumă pe care o accepți pierdută integral), risc 0,25%/trade, 1–3 luni
- [ ] 5. Comparație live vs backtest pe aceeași perioadă: slippage, rata de umplere, costuri, PnL
- [ ] 6. Scalare treptată (×2 pe lună maximum), doar dacă live-ul e în distribuția backtestului
- [ ] 7. Criterii de oprire scrise ÎNAINTE de start (DD, abatere de la backtest, bug)
```

Diferența backtest–live e normală, dar trebuie **măsurată**. Dacă live-ul iese sistematic sub backtest, de obicei costurile sau umplerea au fost subestimate.

## Securitatea contului

- **Subcont dedicat** botului, cu doar capitalul botului.
- **Cheie API fără drept de retragere.** Doar trading, doar pe piețele folosite. **IP whitelist** pe IP-ul serverului.
- Cheia **nu intră în git** și nu stă în fișiere pe care le citește agentul. Variabile de mediu pe server sau un manager de secrete. Agentul Claude Code nu are acces la ea (`deny` în permisiuni plus `denyRead` în sandbox, vezi `aparare-prompt-injection`).
- 2FA pe contul de bursă. Cheile se rotesc periodic; cele vechi se revocă.
- Cheie separată **read-only** pentru monitor și rapoarte.

## Robustețea motorului

Checklist-ul complet de producție e în [reference/productie.md](reference/productie.md): ordine idempotente (`clientOrderId`), reconciliere cu bursa la pornire și periodic, kill switch (manual, automat, dead man's switch), rate limits, reconectare, date lipsă, ceas sincronizat, jurnal, alerte pe telefon, unde rulează.

## Ce face agentul (Claude) în proiectul de trading

- Cercetare: rulează `edge_scan.py`, engine-ul, sweep-urile; scrie rapoarte scurte cu concluzia sus.
- Ține **registrul de încercări** (pentru DSR) și `CONTEXT_*.md` actualizat, ca o sesiune nouă să știe tot.
- Transformă ideile din cărți în ipoteze testabile (`carti-in-ipoteze`).
- Scrie și testează codul motorului: teste unitare pe semnal, test că live și backtest dau aceleași semnale pe aceleași bare.
- Monitorizare: rapoarte zilnice din jurnal (PnL, trade-uri, abateri, alerte).
- **Nu:** plasează ordine, schimbă parametri live fără aprobare, citește cheile, „ajustează” strategia după câteva zile proaste, decide din știri.

System prompt gata de folosit pentru agentul de cercetare: [reference/system-prompt.md](reference/system-prompt.md).

## Impozite (România, cripto)

Pe scurt: **16%** pe câștigul din cripto realizat din 2026 (10% pentru 2025), declarația unică până pe **25 mai** anul următor, scutire doar sub 200 lei per tranzacție și 600 lei pe an, plus CASS peste pragul de 6 salarii minime. Detalii și ce să ții în jurnal: [reference/fiscal-ro.md](reference/fiscal-ro.md). Pentru situația ta exactă (forex/CFD, bursă din străinătate, sume mari): contabil.

## Onestitate față de tine

- Majoritatea strategiilor retail nu au edge după costuri. În proiectul tău, 1 din ~20 de semnale a supraviețuit, și e subțire.
- „100% profitabil pe 5 minute” pe un screenshot TradingView e aproape sigur lookahead, repainting sau o fereastră norocoasă.
- Suma pe live o alegi ca pe una pe care o poți pierde integral fără să-ți afecteze viața.
