# Arcadian Residence — site de prezentare

Site static pentru ansamblul Arcadian Residence din Ceuașu de Câmpie, jud. Mureș.
Deschide `index.html` sau servește folderul: `python3 -m http.server`.

## Decizia estetică

- **Public:** cupluri tinere și familii din Târgu Mureș care fac naveta și compară un apartament de aici cu o casă.
- **Ton:** sobru, de proiect de arhitectură: suprafețe la zecimală, materiale, fișă tehnică. Tot conținutul vine din broșura tipărită.
- **Paleta vine din clădire:** alb cald ca tencuiala parterului, antracit ca tabla fălțuită a etajului, stejar și terrazzo din interioare. Verdele apare doar ca marcaj activ (camera selectată, butonul de apel).
- **Logoul** e cel din broșură și flyer (verde `#283525`, auriu `#a2885c`), vectorizat cu potrace. Sursele sunt în `assets/img/brand/`; pe site e folosit prin `logo-sprite.svg` (`#wordmark`, `#lockup`, `#symbol`), cu culorile din `--logo-ink` și `--logo-gold`, ca să se schimbe odată cu bara.
- **Tipografie:** Archivo condensat pentru titluri, care repetă ritmul vertical al tablei, și Montserrat pentru text. Montserrat e fontul broșurii și e păstrat intenționat.
- **Animații, fiecare cu motivul ei:**
  - loaderul: fundalul e făcut din panourile fațadei, randările apar pe rând în ramă (fiecare după ce s-a încărcat), apoi rama se strânge în linia din mijloc și panourile se deschid peste copertă (o singură dată pe sesiune);
  - între pagini se închid și se deschid panourile verticale ale fațadei, cu numele paginii destinație;
  - axonometria rămâne fixată, iar scroll-ul face zoom pe zonele din broșură;
  - secțiunea nZEB e desenată ca o secțiune prin fațada de sud: soarele de iarnă intră jos în cameră, cel de vară e oprit de stor;
  - planul unui apartament se descoperă pornind de la ușa de intrare;
  - în turul prin apartament, fiecare fotografie aprinde pe plan încăperea în care a fost făcută.
- **Elemente memorabile:**
  - planul interactiv: tabelul de suprafețe e legat de plan (hover sau tap pe o cameră o aprinde în ambele);
  - cei „15 min” până la Târgu Mureș, desenați ca linie de cotă;
  - coperta, care se deschide în fâșii verticale, ca panourile fațadei.

## Structură

Paginile se generează din `src/` cu `python3 build.py`. Nu edita direct fișierele `.html` din rădăcină.

- `src/partials/`: `layout.html` (head, bara de sus, meniu, cortină, footer), `loader.html`, `cta.html`.
- `src/pages/`: conținutul fiecărei pagini (`index`, `ansamblu`, `tip-1`, `tip-2`, `contact`).
- `assets/css/site.css`, `assets/js/site.js`: stilul și interacțiunile. Datele apartamentelor sunt în `APT`.
- `assets/vendor/`: GSAP 3.15 + ScrollTrigger, Lenis, vendorizate local.
- `assets/fonts/`: Archivo și Montserrat, variabile, subseturi latin și latin-ext.
- `assets/img/`: randările și planurile extrase din PDF-ul broșurii, la rezoluția lor nativă (2041–2821 px), în trei mărimi: `-900`, `-1800` și `-hd`. Excepție: `ext-alee-2-1800` e mărită 2× cu Upscayl (high-fidelity), pentru că în broșură e doar la 1073 px.
- `assets/img/brand/`: logoul (SVG pentru fundal deschis și `-light` pentru închis), favicon, apple-touch-icon. `assets/img/og.jpg` e imaginea pentru linkuri distribuite.

## Tur 3D (`tur.html`)

- Modelul vine din IFC-ul ArchiCAD (`Locuințe colective.ifc`), convertit cu `~/Projects/arcadian-3d/tools/build_tour.py` (ifcopenshell) și comprimat cu `gltf-transform meshopt`: 48 MB → 9,3 MB în `assets/3d/arcadian.glb`.
- Foile de ușă sunt separate de tocuri la conversie (balamaua e pe muchia opusă mânerului) și se rotesc în shader când te apropii, departe de tine. Datele sunt în `assets/3d/doors.json`.
- Texturile sunt ambientCG (CC0), proiectate triplanar, fără UV-uri. Planurile din colț sunt randate din același model cu Blender (`tools/plan2.py`); `assets/3d/plan.json` ține limitele lor și punctele de pornire.
- Coliziunea: un singur BVH (three-mesh-bvh) din toată geometria statică; capsula pornește de la 38 cm, ca treptele să se urce singure.
- three.js r170 e vendorizat în `assets/vendor/three/`. `tur.html?debug` expune `window.__tur` pentru teste.

## Surse

- Textul, cifrele și numărul de vânzări (0770 916 916) vin din broșura și flyerul oficial.
- Creditul „Studio Holm & Inhabit Studio” nu apare în broșură sau în flyer; trebuie confirmat cu clientul.
- Zonele camerelor din plan (`rooms` în `site.js`, în % din plan) sunt trasate aproximativ.
