# Botul în producție: checklist

## Cuprins
- Ordine și stare
- Kill switch
- Date de piață
- Infrastructură
- Jurnal și alerte
- Test înainte de live

## Ordine și stare

- **Idempotență:** fiecare ordin are un `clientOrderId` determinist (de exemplu `strategie-simbol-timestampBară-latură`). Dacă o cerere pică la timeout și o retrimiți, bursa refuză duplicatul în loc să deschidă a doua poziție.
- **Sursa de adevăr e bursa**, nu memoria botului. La pornire și periodic (la fiecare bară): citești pozițiile și ordinele deschise de pe bursă și le compari cu starea internă. La nepotrivire: alertă și **oprire**, nu „corectare” automată.
- **Stopul stă pe bursă** (ordin stop real, `reduceOnly`), nu doar în memoria botului. Dacă botul moare, stopul rămâne.
- Retry-uri **limitate** (de exemplu 3, cu pauză crescătoare), apoi alertă. Niciodată buclă infinită de ordine.
- Verifici `filled`, `partially filled`, `rejected`, `expired`. Umplerea parțială e normală.
- Rotunjirea cantității și a prețului la pașii simbolului (`stepSize`, `tickSize`), citiți din API, nu hardcodați.

## Kill switch

Trei declanșatoare, toate duc la: anulează ordinele deschise → închide sau acoperă pozițiile (sau le lasă cu stop, după regulă) → nu mai trimite nimic → alertă.
1. **Automat:** limitele din `risc-si-dimensionare` (pierdere zilnică, DD, pierderi la rând, expunere, nepotrivire la reconciliere).
2. **Manual:** un fișier (`STOP`), o variabilă de mediu sau o comandă pe telefon (bot Telegram) pe care motorul o verifică înainte de **fiecare** ordin.
3. **Dead man's switch:** dacă motorul nu dă semn de viață N minute, un proces separat (sau serviciul bursei, unde există, cum e „cancel all after” pe unele burse) anulează ordinele.

## Date de piață

- Semnalul doar pe **bare închise**, exact ca în backtest.
- Detectezi barele lipsă sau întârziate. Dacă datele sunt vechi (> 2 bare), botul nu tranzacționează.
- Ceasul serverului sincronizat (NTP). Bursele resping cererile cu timestamp decalat.
- Respecți rate limits. Preferi websocket pentru date și REST doar pentru ordine. Ai văzut deja ce înseamnă un IP ban de 2 ore.
- La reconectare după o cădere: întâi reconciliere, abia apoi semnale noi.

## Infrastructură

- Rulează pe un **VPS** (sau cloud), nu pe laptop: laptopul tău cu bateria la 17% se stinge când îl scoți din priză. Pornire automată cu `systemd` (`Restart=always`).
- Un singur proces activ per strategie și cont (fișier lock). Două instanțe = ordine duble.
- Configurația (parametrii înghețați) într-un fișier versionat în git. Schimbările trec prin commit, cu motiv.
- Cheile doar în variabile de mediu pe server (`EnvironmentFile=` în systemd, cu permisiuni 600).

## Jurnal și alerte

- Jurnal structurat (JSON pe linie) pentru: semnal, ordin trimis, răspuns bursă, umplere, stop, eroare, declanșare limite. Plus prețul așteptat vs prețul real (slippage măsurat).
- Alerte pe telefon (Telegram sau ntfy) pentru: trade deschis/închis, eroare, limită atinsă, kill switch, bot oprit, nepotrivire la reconciliere.
- Raport zilnic automat: PnL, trade-uri, slippage mediu, comparație cu backtestul pe aceeași perioadă.

## Test înainte de live

```
- [ ] Testnet: ordin, anulare, stop, umplere parțială, eroare de rețea simulată
- [ ] Repornire în mijlocul unei poziții → reconcilierea o găsește și o gestionează corect
- [ ] Ordin retrimis după timeout → nu se dublează (clientOrderId)
- [ ] Kill switch manual → anulează tot în câteva secunde
- [ ] Date oprite → botul nu tranzacționează
- [ ] Limita zilnică atinsă → nu mai deschide nimic
- [ ] Semnalele din motorul live = semnalele din backtest pe aceleași bare (test automat)
```
