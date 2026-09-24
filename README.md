# Arcadian Residence — site de prezentare

Site static pentru ansamblul Arcadian Residence din Ceuașu de Câmpie, jud. Mureș.
Deschide `index.html` sau servește folderul: `python3 -m http.server`.

## Decizia estetică

- **Public:** cupluri tinere și familii din Târgu Mureș care fac naveta și compară un apartament de aici cu o casă.
- **Ton:** sobru, de proiect de arhitectură: suprafețe la zecimală, materiale, fișă tehnică. Tot conținutul vine din broșura tipărită.
- **Paleta vine din clădire:** alb cald ca tencuiala parterului, antracit ca tabla fălțuită a etajului, stejar și terrazzo din interioare. Verdele copertei broșurii apare doar ca marcaj activ (camera selectată, butonul de apel).
- **Tipografie:** Archivo condensat pentru titluri, care repetă ritmul vertical al tablei, și Montserrat pentru text. Montserrat e fontul broșurii și e păstrat intenționat.
- **Elemente memorabile:**
  - planul interactiv: tabelul de suprafețe e legat de plan (hover sau tap pe o cameră o aprinde în ambele);
  - cei „15 min” până la Târgu Mureș, desenați ca linie de cotă;
  - coperta, care se deschide în fâșii verticale, ca panourile fațadei.

## Structură

- `index.html`: o singură pagină, cu secțiuni numerotate ca planșe (A.01–A.05).
- `assets/css/site.css`, `assets/js/site.js`: stilul și interacțiunile. Datele apartamentelor sunt în `APT`.
- `assets/vendor/`: GSAP 3.15 + ScrollTrigger, Lenis, vendorizate local.
- `assets/fonts/`: Archivo și Montserrat, variabile, subseturi latin și latin-ext.
- `assets/img/`: randări și planuri extrase din fotografiile broșurii (corecție de perspectivă, denoise, balans de alb).

## De înlocuit când vin materialele originale

Imaginile sunt fotografiate din broșura tipărită (~1750 px lățime, cu grain de tipar).
Randările originale de la Studio Holm / Inhabit Studio vor ridica vizibil calitatea copertei.
Zonele camerelor din plan (`rooms` în `site.js`, în % din plan) sunt trasate aproximativ.
