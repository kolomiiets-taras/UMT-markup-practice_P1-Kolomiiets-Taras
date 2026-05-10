(function () {
  'use strict';

  initAos();
  initMobileMenu();

  function initAos() {
    if (typeof window.AOS === 'undefined') return;
    window.AOS.init({
      duration: 600,
      easing: 'ease-out-quad',
      once: true,
      offset: 80,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }

  function initMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const openBtn = document.querySelector('[data-menu-open]');
    const closeBtn = menu && menu.querySelector('[data-menu-close]');
    const links = menu ? menu.querySelectorAll('[data-menu-link]') : [];

    if (!menu || !openBtn || !closeBtn) return;

    function open() {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      closeBtn.focus();
    }

    function close() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      openBtn.focus();
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    links.forEach(link => link.addEventListener('click', close));

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        close();
      }
    });

    const desktopMq = window.matchMedia('(min-width: 1440px)');
    desktopMq.addEventListener('change', event => {
      if (event.matches && menu.classList.contains('is-open')) close();
    });
  }
})();
