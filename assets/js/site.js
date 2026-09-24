/* Arcadian Residence — interacțiuni comune și pe pagini.
   Suprafețele sunt cele din broșură. Zonele (x, y, w, h în % din plan) sunt trasate peste
   planurile scanate și sunt aproximative. */
(() => {
  const APT = {
    t1: {
      name: 'Tip 1', w: 1028, h: 1374, total: '71,3', door: [52, 98],
      desc: 'Un apartament de 71,3 m², cu acces direct din exterior. Zona de zi, generoasă și luminoasă, se leagă de spațiul de noapte și de birou, fiecare clar delimitat. Gândit pentru un cuplu tânăr.',
      extra: 'Construcție nZEB, aliniată standardelor actuale de eficiență energetică.',
      rooms: [
        ['Living', '12', [58, 52, 37, 44]],
        ['Dormitor', '13,8', [6, 52, 38, 42]],
        ['Bucătărie', '11,8', [46, 4, 49, 26]],
        ['Dining', '11,6', [46, 30, 41, 22]],
        ['Birou', '8,7', [6, 4, 38, 25]],
        ['Baie', '4,3', [6, 30, 22, 20]],
        ['Hol', '5,8', [29, 29, 16, 23]],
        ['Vestibul', '3,3', [45, 80, 13, 16]],
      ],
      // fișier, legendă, lățime, înălțime, încăperile în care e făcută fotografia
      photos: [
        ['t1-living', 'Living cu deschidere spre grădină', 1764, 1012, [0]],
        ['t1-dining', 'Dining, cu biroul vitrat în fundal', 1754, 1165, [3, 4]],
        ['t1-dormitor', 'Dormitor cu dressing pe toată lungimea peretelui', 1751, 1102, [1]],
        ['t1-baie', 'Baie cu duș walk-in', 1765, 1104, [5]],
      ],
    },
    t2: {
      name: 'Tip 2', w: 1815, h: 1346, total: '122,26', door: [41, 98],
      desc: 'Un apartament de 4 camere, cu zona de zi clar separată de cea de noapte. Livingul deschis se continuă cu bucătăria și iese pe un balcon de 8,43 m². Două dormitoare, birou independent și două băi complete.',
      extra: 'Balconul de 8,43 m² nu e inclus în suprafața utilă. Construcție nZEB.',
      rooms: [
        ['Vestibul', '5,29', [36, 72, 9, 22]],
        ['Living', '29,93', [3, 15, 41, 40]],
        ['Bucătărie', '14,57', [3, 55, 33, 24]],
        ['Cămară', '5,81', [3, 80, 21, 13]],
        ['Grup sanitar', '2,89', [24, 80, 11, 13]],
        ['Hol', '10,19', [45, 60, 41, 12]],
        ['Dormitor 1', '17,35', [50, 15, 24, 44]],
        ['Dormitor 2', '14,90', [76, 15, 22, 33]],
        ['Birou', '8,46', [50, 73, 24, 20]],
        ['Baie 1', '4,83', [86, 47, 12, 24]],
        ['Baie 2', '8,04', [75, 73, 23, 20]],
      ],
      photos: [
        ['t2-living', 'Living, cu bucătăria pe peretele din fundal', 1777, 1039, [1]],
        ['t2-bucatarie', 'Insula bucătăriei, cu livingul în spate', 1795, 1055, [2, 1]],
        ['t2-birou', 'Birou cu lumină de sus', 1834, 1183, [8]],
        ['t2-dormitor', 'Dormitor', 1823, 1103, [6, 7]],
        ['t2-baie', 'Baie cu duș walk-in', 1921, 1140, [9, 10]],
      ],
    },
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;
  const page = document.body.dataset.page;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined' && !reduce;
  const store = {
    get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: k => { try { sessionStorage.removeItem(k); } catch (e) {} },
  };
  let lenis = null;

  /* ================= bara de sus ================= */
  const bar = $('#bar');
  const dark = $('.hero, .contact--page');
  const updateBar = () => {
    const limit = dark ? dark.offsetHeight - 72 : 24;
    bar.classList.toggle('is-solid', scrollY > limit);
  };
  addEventListener('scroll', updateBar, { passive: true });
  updateBar();

  /* ================= meniu pe ecrane înguste ================= */
  const menuBtn = $('.bar__menu'), menu = $('#menu');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.textContent = open ? 'Închide' : 'Meniu';
    html.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      lenis && lenis.stop();
      if (motion) {
        gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .55, ease: 'power3.inOut' });
        gsap.fromTo($$('.menu__list a', menu), { yPercent: 110 }, { yPercent: 0, duration: .6, ease: 'power3.out', stagger: .06, delay: .2 });
      }
    } else {
      lenis && lenis.start();
      if (motion) gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .45, ease: 'power3.inOut', onComplete: () => { menu.hidden = true; } });
      else menu.hidden = true;
    }
  }
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });

  /* ================= cortina dintre pagini =================
     Panourile verticale ale fațadei se închid peste pagina curentă, pe ele apare numele
     paginii în care intri, apoi se deschid pe pagina nouă. */
  const curtain = $('.curtain'), strips = $('.curtain__strips'), cLabel = $('.curtain__label');
  const N = innerWidth < 700 ? 7 : 12;
  strips.style.setProperty('--n', N);
  strips.innerHTML = '<i></i>'.repeat(N);
  const panels = $$('i', strips);
  const fromCenter = i => Math.abs(i - (N - 1) / 2) * .05;

  function leave(href, text) {
    store.set('arc-nav', text || ' ');
    if (!motion) { location.href = href; return; }
    cLabel.textContent = text;
    curtain.style.visibility = 'visible';
    gsap.timeline({ onComplete: () => { location.href = href; } })
      .set(panels, { transformOrigin: '50% 0%' })
      .to(panels, { scaleY: 1, duration: .62, ease: 'power3.inOut', stagger: fromCenter })
      .fromTo(cLabel, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: .45, ease: 'power3.out' }, '-=.3');
  }

  function arrive() {
    const text = store.get('arc-nav');
    store.del('arc-nav');
    cLabel.textContent = text && text.trim() ? text : '';
    gsap.set(panels, { scaleY: 1, transformOrigin: '50% 100%' });
    curtain.style.background = 'transparent';
    return gsap.timeline({ onComplete: resetCurtain })
      .to(cLabel, { opacity: 0, yPercent: -30, duration: .35, ease: 'power2.in' }, .15)
      .to(panels, { scaleY: 0, duration: .75, ease: 'power3.inOut', stagger: fromCenter }, .25);
  }

  function resetCurtain() {
    html.classList.remove('is-arriving');
    curtain.style.visibility = 'hidden';
    curtain.style.background = '';
    if (motion) { gsap.set(panels, { scaleY: 0 }); gsap.set(cLabel, { opacity: 0 }); }
  }
  // înapoi din istoric: pagina poate reveni cu cortina încă închisă
  addEventListener('pageshow', e => { if (e.persisted) { resetCurtain(); store.del('arc-nav'); } });

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/(\.html|\/)$/.test(url.pathname)) return;
    const same = url.pathname === location.pathname || (url.pathname.endsWith('/index.html') && location.pathname.endsWith('/'));
    if (same) {
      if (url.hash) return;
      e.preventDefault();
      if (!menu.hidden) setMenu(false);
      lenis ? lenis.scrollTo(0, { duration: 1.2 }) : scrollTo(0, 0);
      return;
    }
    e.preventDefault();
    if (!menu.hidden) { menu.hidden = true; html.classList.remove('menu-open'); }
    leave(url.href, a.dataset.label || a.textContent.trim());
  });

  /* ================= loader: silueta se desenează pe măsură ce se încarcă randările ================= */
  function runLoader() {
    const loader = $('#loader');
    if (!loader || !html.classList.contains('is-loading')) { html.classList.remove('is-loading'); return Promise.resolve(false); }
    if (!motion) { html.classList.remove('is-loading'); return Promise.resolve(false); }

    // fălțuirile tablei: linii verticale pe etaj, de la acoperiș la cornișa parterului
    const g = $('.ld-seams', loader), ns = 'http://www.w3.org/2000/svg';
    const roof = x => x < 188 ? 128 - (x - 52) * (54 / 136) : x < 298 ? 112 : x < 468 ? 100 : 112;
    for (let x = 62; x < 588; x += 11) {
      const l = document.createElementNS(ns, 'line');
      l.setAttribute('x1', x); l.setAttribute('x2', x); l.setAttribute('y1', roof(x) + 1); l.setAttribute('y2', 157);
      g.appendChild(l);
    }
    const prep = els => els.forEach(el => { const L = el.getTotalLength(); el.style.strokeDasharray = L; el.style.strokeDashoffset = L; });
    const lines = $$('.ld, .ld-seams line', loader);
    prep(lines);

    const draw = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
      .to('.ld--ground', { strokeDashoffset: 0, duration: .12 })
      .to('.ld--body', { strokeDashoffset: 0, duration: .3 })
      .to('.ld--floor', { strokeDashoffset: 0, duration: .08 })
      .to('.ld-seams line', { strokeDashoffset: 0, duration: .06, stagger: .005 })
      .to('.ld--win', { strokeDashoffset: 0, duration: .14, stagger: .04 });

    // progres real: imaginile care nu sunt lazy + fonturile
    const imgs = $$('img').filter(i => i.loading !== 'lazy');
    let done = 0; const total = imgs.length + 1;
    const pct = $('#loader-pct'), shown = { p: 0 };
    const bump = () => {
      done++;
      gsap.to(shown, { p: done / total, duration: .6, ease: 'power2.out', overwrite: true,
        onUpdate: () => { draw.progress(shown.p); pct.textContent = Math.round(shown.p * 100); } });
    };
    imgs.forEach(i => (i.complete ? bump() : (i.addEventListener('load', bump, { once: true }), i.addEventListener('error', bump, { once: true }))));
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(bump);

    const minTime = new Promise(r => setTimeout(r, 1500));
    const allIn = new Promise(r => { const t = setInterval(() => { if (shown.p > .995) { clearInterval(t); r(); } }, 60); setTimeout(() => { clearInterval(t); r(); }, 7000); });

    return Promise.all([minTime, allIn]).then(() => new Promise(res => {
      draw.progress(1); pct.textContent = '100';
      gsap.timeline({ onComplete: () => { loader.remove(); html.classList.remove('is-loading'); res(true); } })
        .to('.ld--win', { fill: 'rgba(217,185,143,.35)', duration: .35, stagger: .03 })  // se aprind ferestrele, ca în randări
        .to(loader.children, { opacity: 0, duration: .45, ease: 'power2.in' }, '+=.25');
    }));
  }

  /* ================= plan interactiv (paginile Tip 1 / Tip 2) ================= */
  function initPlan(a) {
    const stage = $('#plan-stage'), img = $('#plan-img'), zones = $('#plan-zones'), marks = $('#plan-marks'), body = $('#rooms-body');
    stage.style.setProperty('--ar', (a.w / a.h).toFixed(3));
    img.width = a.w; img.height = a.h;
    $('#apt-desc').textContent = a.desc; $('#apt-extra').textContent = a.extra;
    $('#rooms-total').textContent = a.total + ' m²';
    zones.innerHTML = a.rooms.map(([, , [x, y, w, h]]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('');
    marks.innerHTML = a.rooms.map(([n, m2, [x, y, w, h]], i) =>
      `<button class="mark" type="button" style="left:${x + w / 2}%;top:${y + h / 2}%" aria-label="${n}, ${m2} m²">${i + 1}</button>`).join('');
    body.innerHTML = a.rooms.map(([n, m2], i) =>
      `<tr tabindex="0"><td>${String(i + 1).padStart(2, '0')}</td><td>${n}</td><td class="num">${m2}</td></tr>`).join('');

    let pinned = null;
    const light = i => {
      $$('rect', zones).forEach((r, k) => r.classList.toggle('is-on', k === i));
      $$('.mark', marks).forEach((m, k) => m.classList.toggle('is-on', k === i));
      $$('tr', body).forEach((t, k) => t.classList.toggle('is-on', k === i));
    };
    const bind = (el, i) => {
      el.addEventListener('mouseenter', () => light(i));
      el.addEventListener('mouseleave', () => light(pinned));
      el.addEventListener('focus', () => light(i));
      el.addEventListener('blur', () => light(pinned));
      el.addEventListener('click', () => { pinned = pinned === i ? null : i; light(pinned); });
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
    };
    $$('.mark', marks).forEach(bind);
    $$('tr', body).forEach(bind);

    if (!motion) return;
    // planul se descoperă pornind de la ușa de intrare, cum intri și în apartament
    const [dx, dy] = a.door;
    gsap.set(stage, { clipPath: `circle(0% at ${dx}% ${dy}%)` });
    gsap.set($$('.mark', marks), { scale: 0 });
    gsap.set($$('tr', body), { opacity: 0, x: -10 });
    gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top 72%', once: true } })
      .to(stage, { clipPath: `circle(150% at ${dx}% ${dy}%)`, duration: 1.6, ease: 'power2.inOut' })
      .to($$('.mark', marks), { scale: 1, duration: .45, ease: 'back.out(2.4)', stagger: .05, clearProps: 'transform' }, .7)
      .to($$('tr', body), { opacity: 1, x: 0, duration: .4, ease: 'power2.out', stagger: .045, clearProps: 'all' }, .5);
  }

  /* ================= tur: fiecare fotografie aprinde încăperea ei pe plan ================= */
  function initTour(a) {
    const zones = $('#tour-zones'), where = $('#tour-where'), wrap = $('#tour-photos');
    $('#tour-stage').style.setProperty('--ar', (a.w / a.h).toFixed(3));
    zones.innerHTML = a.rooms.map(([, , [x, y, w, h]]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('');
    wrap.innerHTML = a.photos.map(([f, cap, w, h, rooms]) => `
      <figure class="tour__photo" data-rooms="${rooms.join(',')}">
        <div class="tour__mask"><img src="assets/img/${f}-1800.webp" srcset="assets/img/${f}-900.webp 900w, assets/img/${f}-1800.webp 1800w"
          sizes="(min-width: 900px) 55vw, 100vw" width="${w}" height="${h}" loading="lazy" alt="${cap}"></div>
        <figcaption><span>${cap}</span><b>${rooms.map(r => a.rooms[r][0]).join(' · ')}</b></figcaption>
      </figure>`).join('');

    const rects = $$('rect', zones);
    const show = rooms => {
      rects.forEach((r, k) => r.classList.toggle('is-on', rooms.includes(k)));
      const names = rooms.map(r => a.rooms[r][0]).join(' · ');
      const m2 = rooms.map(r => a.rooms[r][1] + ' m²').join(' · ');
      where.innerHTML = `${names}<small>${m2}</small>`;
    };
    const figs = $$('.tour__photo', wrap);
    show(figs[0].dataset.rooms.split(',').map(Number));
    // IntersectionObserver ca să meargă și fără animații: activă e fotografia din mijlocul ecranului
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) show(e.target.dataset.rooms.split(',').map(Number));
    }), { rootMargin: '-48% 0px -48% 0px' });
    figs.forEach(f => io.observe(f));

    if (!motion) return;
    figs.forEach(f => gsap.fromTo($('img', f), { scale: 1.14 }, { scale: 1, ease: 'none',
      scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom 40%', scrub: true } }));
  }

  /* ================= animații pe pagini ================= */
  function heroIn(withSeams) {
    const seams = $('.seams');
    const reveal = () => { html.classList.remove('js-motion'); seams && seams.remove(); };
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: reveal });
    if (withSeams && seams) {
      const n = N;
      seams.style.setProperty('--n', n);
      seams.innerHTML = '<i></i>'.repeat(n);
      seams.style.background = 'transparent';
      tl.to($$('i', seams), { scaleY: 0, duration: 1.1, stagger: i => Math.abs(i - (n - 1) / 2) * .07 }, 0);
    } else if (seams) seams.remove();
    tl.from('.hero__img img', { scale: 1.08, duration: 1.8, ease: 'power2.out' }, 0)
      .fromTo('.hero__title', { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, ease: 'power3.out' }, withSeams ? .55 : .25)
      .to('.hero .sheet, .hero__lede', { opacity: 1, duration: .7 }, withSeams ? .9 : .5)
      .fromTo('.hero__cartus > div', { y: 12 }, { opacity: 1, y: 0, duration: .5, stagger: .08, ease: 'power2.out' }, withSeams ? 1 : .6);
    gsap.to('.hero__img img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  // antetul paginilor interioare: titlul urcă, iar fotografia se descoperă ca un stor care se ridică
  function pheadIn() {
    const head = $('.phead'); if (!head) return;
    const img = $('.phead__img img', head);
    gsap.timeline({ onComplete: () => html.classList.remove('js-motion') })
      .fromTo($('.phead__title', head), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, ease: 'power3.out' }, .1)
      .to([$('.sheet', head), $('.phead__lede', head)], { opacity: 1, duration: .6, stagger: .1 }, .35)
      .fromTo($('.phead__img', head), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power3.inOut' }, .2)
      .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, .2);
    gsap.fromTo(img, { yPercent: 0 }, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: head, start: 'top top', end: 'bottom top', scrub: true } });
  }

  function cotaIn() {
    const line = $('.cota__line'); if (!line) return;
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set('.cota__value', { opacity: 0 });
    gsap.timeline({ scrollTrigger: { trigger: '.cota', start: 'top 75%', end: 'center 45%', scrub: .6 } })
      .from('.cota__road', { opacity: 0, duration: .3 })
      .from('.cota__ext, .cota__tick', { opacity: 0, duration: .2 }, 0)
      .to(line, { strokeDashoffset: 0, duration: 1, ease: 'none' })
      .to('.cota__value', { opacity: 1, duration: .25 }, '-=.15');
  }

  // masterplan: axonometria rămâne fixată, iar scroll-ul duce camera din zonă în zonă
  function axoIn() {
    const sec = $('.axopin'); if (!sec) return;
    const frame = $('.axopin__frame', sec), img = $('.axopin__img', sec), notes = $$('.axopin__note', sec);
    // punctul (x%, y%) din desen ajunge în centrul cadrului; ține cont de object-fit: cover pe mobil
    const at = (x, y, s) => () => {
      const w = frame.clientWidth, h = frame.clientHeight, iw = 2033, ih = 896;
      const k = Math.max(w / iw, h / ih), ox = (w - iw * k) / 2, oy = (h - ih * k) / 2;
      const px = ox + x / 100 * iw * k, py = oy + y / 100 * ih * k;
      const clamp = (v, lo) => Math.min(0, Math.max(lo, v));
      return { scale: s, x: clamp(w / 2 - px * s, w - w * s), y: clamp(h / 2 - py * s, h - h * s) };
    };
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: {
      trigger: sec, start: 'top top', end: () => '+=' + innerHeight * 3, pin: $('.axopin__stage', sec), scrub: .8, invalidateOnRefresh: true,
      onUpdate: self => { const k = Math.min(notes.length - 1, Math.floor(self.progress * notes.length)); notes.forEach((n, i) => n.classList.toggle('is-on', i === k)); },
    } });
    notes.forEach((n, i) => {
      const f = at(+n.dataset.x, +n.dataset.y, +n.dataset.s);
      tl.to(img, { scale: () => f().scale, x: () => f().x, y: () => f().y, duration: 1 }, i === 0 ? 0 : '>');
      tl.to({}, { duration: .6 });
    });
    tl.to(img, { scale: 1, x: 0, y: 0, duration: 1 });
  }

  // cuprins: fotografia paginii urmărește cursorul
  function tocIn() {
    const peek = $('.toc__peek'); if (!peek || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const pImg = $('img', peek);
    const qx = gsap.quickTo(peek, 'x', { duration: .55, ease: 'power3.out' });
    const qy = gsap.quickTo(peek, 'y', { duration: .55, ease: 'power3.out' });
    addEventListener('mousemove', e => { qx(e.clientX + 24); qy(e.clientY); }, { passive: true });
    $$('.toc__row').forEach(row => {
      row.addEventListener('mouseenter', () => {
        pImg.src = row.dataset.img;
        gsap.to(peek, { opacity: 1, scale: 1, rotate: -2, duration: .45, ease: 'power3.out', overwrite: 'auto' });
      });
      row.addEventListener('mouseleave', () => gsap.to(peek, { opacity: 0, scale: .9, rotate: 0, duration: .3, ease: 'power2.in', overwrite: 'auto' }));
    });
  }

  function contactIn() {
    gsap.timeline({ onComplete: () => html.classList.remove('js-motion') })
      .from('.contact__img img', { scale: 1.12, duration: 1.8, ease: 'power2.out' }, 0)
      .from('.contact__title', { yPercent: 30, opacity: 0, duration: .9, ease: 'power3.out' }, .3)
      .from('.contact__body > p, .contact .call, .credits', { opacity: 0, y: 16, duration: .6, stagger: .1, ease: 'power2.out' }, .5);
  }

  /* ================= pornire ================= */
  const apt = APT[document.body.dataset.type];
  if (apt) { initPlan(apt); initTour(apt); }

  if (!motion) {
    html.classList.remove('js-motion', 'is-loading', 'is-arriving');
    const s = $('.seams'); if (s) s.remove();
    store.del('arc-nav'); store.set('arc-seen', '1');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  lenis = new Lenis({ lerp: .11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = $(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); lenis.scrollTo(t, { offset: -64, duration: 1.4 });
  }));

  const arriving = html.classList.contains('is-arriving');
  const intro = {
    home: () => { heroIn(!arriving); tocIn(); },
    ansamblu: () => { pheadIn(); cotaIn(); axoIn(); },
    apt: () => { pheadIn(); },
    contact: () => { contactIn(); },
  }[page] || (() => {});

  (arriving ? Promise.resolve(false) : runLoader()).then(() => {
    store.set('arc-seen', '1');
    intro();
    if (arriving) arrive();
    ScrollTrigger.refresh();
  });
})();
