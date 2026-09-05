(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initHeroEntrance(reduced);
    initScrollReveal(reduced);
  });

  function initHeroEntrance(reduced) {
    const name1 = document.getElementById('mz-name-1');
    const name2 = document.getElementById('mz-name-2');
    const divider = document.getElementById('mz-divider');
    const tagline = document.getElementById('mz-tagline');
    const scroll = document.getElementById('mz-scroll');
    const scrollArrow = document.getElementById('mz-scroll-arrow');
    const flash = document.getElementById('mz-flash');
    const grid = document.getElementById('mz-grid');
    const heroContent = document.getElementById('mz-hero-content');
    const strike = document.getElementById('mz-strike');

    if (reduced) {
      [name1, name2].forEach(el => { if (el) el.style.transform = 'translateY(0)'; });
      if (divider) divider.style.transform = 'scaleX(1)';
      if (tagline) { tagline.style.opacity = '1'; tagline.style.transform = 'none'; }
      if (scroll) scroll.style.opacity = '1';
      return;
    }

    // Stage lights — accent color burst
    if (flash) {
      flash.style.animation = 'flashPulse 0.88s cubic-bezier(0.16,1,0.3,1) forwards';
      setTimeout(() => { flash.style.display = 'none'; }, 940);
    }

    // MUHAMAD slams up
    setTimeout(() => {
      if (name1) name1.style.animation = 'slideUpName 0.72s cubic-bezier(0.16,1,0.3,1) forwards';
    }, 210);

    // REZKI slams up
    setTimeout(() => {
      if (name2) name2.style.animation = 'slideUpName 0.72s cubic-bezier(0.16,1,0.3,1) forwards';
    }, 390);

    // Divider draws
    setTimeout(() => {
      if (divider) divider.style.animation = 'dividerExpand 0.65s cubic-bezier(0.16,1,0.3,1) forwards';
    }, 790);

    // Tagline fades up
    setTimeout(() => {
      if (tagline) tagline.style.animation = 'fadeUpIn 0.55s ease forwards';
    }, 990);

    // Signature moment: REZKI is struck like a stamp — spark, shockwave, recoil
    setTimeout(() => {
      if (name2) name2.style.animation = 'rezkiImpact 0.5s cubic-bezier(0.2,0.85,0.25,1) forwards';
      if (heroContent) {
        heroContent.style.animation = 'heroRecoil 0.42s ease-out';
        heroContent.addEventListener('animationend', () => { heroContent.style.animation = 'none'; }, { once: true });
      }
      if (grid) {
        grid.style.animation = 'gridShock 0.7s ease-out';
        grid.addEventListener('animationend', () => {
          grid.style.animation = 'gridBreath 7s ease-in-out infinite';
        }, { once: true });
      }
      if (strike) strike.style.animation = 'strikeFlash 0.34s ease-out forwards';
    }, 1090);

    // Scroll hint
    setTimeout(() => {
      if (scroll) {
        scroll.style.animation = 'fadeUpIn 0.5s ease forwards';
        setTimeout(() => {
          if (scrollArrow) scrollArrow.style.animation = 'arrowBounce 2.2s ease-in-out infinite';
        }, 560);
      }
    }, 1360);
  }

  function initScrollReveal(reduced) {
    const elements = document.querySelectorAll('[data-reveal]');

    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    elements.forEach(el => el.classList.add('reveal-pending'));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => {
            el.classList.remove('reveal-pending');
            el.classList.add('is-revealed');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  }
})();
