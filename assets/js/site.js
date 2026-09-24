/* Arcadian Residence — interacțiuni
   Suprafețele sunt cele din broșură. Zonele (x, y, w, h în % din plan) sunt trasate peste
   planurile scanate și sunt aproximative. */
(() => {
  const APT = {
    t1: {
      plan: 'assets/img/plan-t1.webp', w: 1028, h: 1374,
      total: '71,3',
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
      photos: [
        ['t1-living', 'Living cu deschidere spre grădină', 1764, 1012],
        ['t1-dormitor', 'Dormitor', 1751, 1102],
        ['t1-dining', 'Dining, cu biroul vitrat în fundal', 1754, 1165],
        ['t1-baie', 'Baie', 1765, 1104],
      ],
    },
    t2: {
      plan: 'assets/img/plan-t2.webp', w: 1815, h: 1346,
      total: '122,26',
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
        ['t2-living', 'Living, cu bucătăria pe peretele din fundal', 1777, 1039],
        ['t2-birou', 'Birou cu lumină de sus', 1834, 1183],
        ['t2-bucatarie', 'Insula bucătăriei, spre living', 1795, 1055],
        ['t2-dormitor', 'Dormitor', 1823, 1103],
        ['t2-baie', 'Baie', 1921, 1140],
      ],
    },
  };

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const hasGsap = typeof window.gsap !== 'undefined';

  /* ---------- planuri ---------- */
  const img = $('#plan-img'), zones = $('#plan-zones'), marks = $('#plan-marks');
  const body = $('#rooms-body'), total = $('#rooms-total');
  const desc = $('#apt-desc'), extra = $('#apt-extra'), gallery = $('#interiors');
  const panel = $('#apt-panel');
  let pinned = null;

  function light(i) {
    $$('rect', zones).forEach((r, k) => r.classList.toggle('is-on', k === i));
    $$('.mark', marks).forEach((m, k) => m.classList.toggle('is-on', k === i));
    $$('tr', body).forEach((t, k) => t.classList.toggle('is-on', k === i));
  }
  const release = () => light(pinned);

  function render(key) {
    const a = APT[key];
    img.src = a.plan; img.width = a.w; img.height = a.h;
    $('#plan-stage').style.setProperty('--ar', (a.w / a.h).toFixed(3));
    img.alt = `Plan apartament ${key === 't1' ? 'tip 1' : 'tip 2'}, ${a.total} m²`;
    desc.textContent = a.desc; extra.textContent = a.extra; total.textContent = a.total + ' m²';
    pinned = null;

    zones.innerHTML = a.rooms.map(([, , [x, y, w, h]]) =>
      `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('');
    marks.innerHTML = a.rooms.map(([n, m2, [x, y, w, h]], i) =>
      `<button class="mark" type="button" style="left:${x + w / 2}%;top:${y + h / 2}%" aria-label="${n}, ${m2} m²">${i + 1}</button>`).join('');
    body.innerHTML = a.rooms.map(([n, m2], i) =>
      `<tr tabindex="0"><td>${String(i + 1).padStart(2, '0')}</td><td>${n}</td><td class="num">${m2}</td></tr>`).join('');

    const cls = ['i1', 'i2', 'i3', 'i4', 'i5'];
    gallery.innerHTML = a.photos.map(([f, cap, w, h], i) => `
      <figure class="${cls[i]}">
        <img src="assets/img/${f}-1800.webp" srcset="assets/img/${f}-900.webp 900w, assets/img/${f}-1800.webp 1800w"
             sizes="(min-width: 900px) 60vw, 100vw" width="${w}" height="${h}" loading="lazy" alt="${cap}">
        <figcaption>${cap}</figcaption>
      </figure>`).join('');

    const bind = (el, i) => {
      el.addEventListener('mouseenter', () => light(i));
      el.addEventListener('mouseleave', release);
      el.addEventListener('focus', () => light(i));
      el.addEventListener('blur', release);
      el.addEventListener('click', () => { pinned = pinned === i ? null : i; light(pinned); });
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
    };
    $$('.mark', marks).forEach(bind);
    $$('tr', body).forEach(bind);

    if (hasGsap && !reduce) {
      gsap.fromTo(img, { opacity: 0 }, { opacity: 1, duration: .6, ease: 'power2.out' });
      gsap.fromTo($$('.mark', marks), { scale: 0 }, { scale: 1, duration: .45, ease: 'back.out(2.2)', stagger: .04, delay: .2, clearProps: 'transform' });
      gsap.fromTo($$('tr', body), { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: .4, ease: 'power2.out', stagger: .03, clearProps: 'all' });
    }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  const tabs = $$('.apt__tabs [role="tab"]');
  function select(tab) {
    tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tab.id);
    render(tab.dataset.type);
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); select(n);
    });
  });
  render('t1');

  /* ---------- bara de sus ---------- */
  const bar = $('#bar'), hero = $('.hero');
  new IntersectionObserver(([e]) => bar.classList.toggle('is-solid', !e.isIntersecting), { rootMargin: '-72px 0px 0px 0px' }).observe(hero);

  const reveal = () => {
    document.documentElement.classList.remove('js-motion');
    const s = $('.seams'); if (s) s.remove();
  };
  if (!hasGsap || reduce) { reveal(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- scroll ---------- */
  const lenis = new Lenis({ lerp: .11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = $(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); lenis.scrollTo(t, { offset: a.getAttribute('href') === '#top' ? 0 : -64, duration: 1.4 });
  }));

  /* Copertă: panourile de tablă se deschid de la centru spre margini, ca să descopere randarea */
  const seams = $('.seams');
  const n = innerWidth < 700 ? 7 : 12;
  seams.style.setProperty('--n', n);
  seams.innerHTML = '<i></i>'.repeat(n);
  seams.style.background = 'transparent';
  const mid = (n - 1) / 2;
  const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
  tl.to($$('i', seams), { scaleY: 0, duration: 1.1, stagger: i => Math.abs(i - mid) * .07 })
    .from('.hero__img img', { scale: 1.08, duration: 1.8, ease: 'power2.out' }, 0)
    .fromTo('.hero__title', { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, ease: 'power3.out' }, .55)
    .to('.hero .sheet, .hero__lede', { opacity: 1, duration: .7 }, .9)
    .fromTo('.hero__cartus > div', { y: 12 }, { opacity: 1, y: 0, duration: .5, stagger: .08, ease: 'power2.out' }, 1)
    .add(reveal);

  /* Randarea se retrage încet sub text la scroll */
  gsap.to('.hero__img img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });

  /* Cota se trasează ca pe planșă, apoi apare timpul */
  const line = $('.cota__line'), road = $('.cota__road');
  const len = line.getTotalLength();
  gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
  gsap.set('.cota__value', { opacity: 0 });
  gsap.timeline({ scrollTrigger: { trigger: '.cota', start: 'top 75%', end: 'center 45%', scrub: .6 } })
    .from(road, { opacity: 0, duration: .3 })
    .from('.cota__ext, .cota__tick', { opacity: 0, duration: .2 }, 0)
    .to(line, { strokeDashoffset: 0, duration: 1, ease: 'none' })
    .to('.cota__value', { opacity: 1, duration: .25 }, '-=.15');

  /* Fotografia de la final se apropie pe măsură ce cobori spre contact */
  gsap.from('.contact__img img', { scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'center center', scrub: true } });
})();
