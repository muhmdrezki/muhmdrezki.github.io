(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Entrance animations are an enhancement: the hidden state lives behind the
     .js class, so if this script never runs the page still renders in full. */
  if (!reduced) {
    document.documentElement.classList.add('js');
    heroEntrance();
    scrollReveal();
  }

  lightbox();

  /* ── Hero ──────────────────────────────────────────────────────────── */

  function heroEntrance() {
    const items = Array.from(document.querySelectorAll('[data-hero-in]'))
      .sort((a, b) => Number(a.dataset.heroIn) - Number(b.dataset.heroIn));

    items.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-in'), 80 + i * 120);
    });
  }

  /* ── Scroll reveal ─────────────────────────────────────────────────── */

  function scrollReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        setTimeout(() => el.classList.add('is-in'), Number(el.dataset.delay) || 0);
      });
    }, { rootMargin: '0px 0px -6% 0px' });

    items.forEach(el => observer.observe(el));

    /* The bottom rootMargin means anything sitting in the last few percent of
       the page — the colophon — never crosses the trigger line, because the
       document cannot scroll any further. Once we are at the end of the page,
       show whatever is left. */
    const revealRest = () => {
      let remaining = 0;
      items.forEach(el => {
        if (el.classList.contains('is-in')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          observer.unobserve(el);
          setTimeout(() => el.classList.add('is-in'), Number(el.dataset.delay) || 0);
        } else {
          remaining++;
        }
      });
      if (!remaining) window.removeEventListener('scroll', onScroll);
    };

    const onScroll = () => {
      const atEnd = window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      if (atEnd) revealRest();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  /* ── Screenshot lightbox ───────────────────────────────────────────── */

  function lightbox() {
    const sets = {
      aturhr: [
        ['assets/img/aturhr-dashboard.jpg', 'AturHR dashboard'],
        ['assets/img/aturhr-web-attendance.jpg', 'AturHR attendance overview'],
        ['assets/img/aturhr-web-employees.jpg', 'AturHR employee directory'],
        ['assets/img/aturhr-web-payslip.jpg', 'AturHR payslip'],
        ['assets/img/aturhr-app-attendance.jpg', 'AturHR mobile attendance'],
        ['assets/img/aturhr-app-approval.jpg', 'AturHR mobile approvals'],
        ['assets/img/aturhr-app-team.jpg', 'AturHR mobile team view']
      ],
      hourit: [
        ['assets/img/hourit-01.jpg', 'hourit landing page'],
        ['assets/img/hourit-02.jpg', 'hourit screen'],
        ['assets/img/hourit-03.jpg', 'hourit screen'],
        ['assets/img/hourit-04.jpg', 'hourit screen'],
        ['assets/img/hourit-05.jpg', 'hourit screen'],
        ['assets/img/hourit-06.jpg', 'hourit screen']
      ],
      galliard: [
        ['assets/img/galliard-waste-management.jpg', 'Waste Management System — case overview']
      ]
    };

    const box = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const dots = document.getElementById('lightbox-dots');
    if (!box || !img || !dots) return;

    const buttons = Array.from(box.querySelectorAll('button'));
    let shots = [];
    let index = 0;
    let opener = null;

    document.querySelectorAll('[data-shots]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const set = sets[trigger.dataset.shots];
        if (!set || !set.length) return;
        opener = trigger;
        shots = set;
        index = 0;
        set.forEach(([src]) => { new Image().src = src; });
        open();
      });
    });

    // Prev/next and the dot strip are meaningless for a single-shot set.
    const stepControls = box.querySelectorAll('[data-lb-prev], [data-lb-next]');
    const focusable = () => buttons.filter(b => !b.hidden);

    function open() {
      const many = shots.length > 1;
      stepControls.forEach(b => { b.hidden = !many; });
      dots.hidden = !many;

      box.classList.add('is-open');
      document.body.classList.add('is-locked');
      document.addEventListener('keydown', onKey);
      render(true);
      buttons[buttons.length - 1].focus();
    }

    function close() {
      box.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      document.removeEventListener('keydown', onKey);
      if (opener) opener.focus();
    }

    function step(delta) {
      index = (index + delta + shots.length) % shots.length;
      render();
    }

    function render(immediate) {
      const [src, alt] = shots[index];

      if (immediate || reduced) {
        img.src = src;
        img.alt = alt;
      } else if (img.getAttribute('src') !== src) {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.985)';
        setTimeout(() => {
          img.src = src;
          img.alt = alt;
          const show = () => { img.style.opacity = '1'; img.style.transform = 'scale(1)'; };
          img.complete ? show() : img.addEventListener('load', show, { once: true });
        }, 120);
      }

      dots.innerHTML = shots.map((_, i) => `<i class="${i === index ? 'is-active' : ''}"></i>`).join('');
    }

    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowRight') { step(1); return; }
      if (e.key === 'ArrowLeft') { step(-1); return; }

      // Keep focus inside the dialog while it is open.
      if (e.key === 'Tab') {
        const reachable = focusable();
        const first = reachable[0];
        const last = reachable[reachable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    box.querySelectorAll('[data-lb-close]').forEach(el => el.addEventListener('click', close));
    box.querySelector('[data-lb-prev]').addEventListener('click', () => step(-1));
    box.querySelector('[data-lb-next]').addEventListener('click', () => step(1));
  }
})();
