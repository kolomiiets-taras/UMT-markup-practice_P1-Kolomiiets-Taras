(function () {
  'use strict';

  const STATE = {
    bouquets: {
      page: 1,
      limit: 4,
      category: 'all',
      items: [],
      total: 0,
      done: false,
      loading: false,
    },
  };

  initAos();
  initMobileMenu();
  initForms();
  initLists();

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

  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.querySelectorAll(':invalid').forEach(el => el.classList.add('is-invalid'));
          const firstInvalid = form.querySelector(':invalid');
          if (firstInvalid) firstInvalid.focus();
          return;
        }
        const kind = form.dataset.form;
        if (kind === 'order') handleOrder(form);
      });

      form.addEventListener('input', event => {
        if (event.target.classList.contains('is-invalid') && event.target.validity.valid) {
          event.target.classList.remove('is-invalid');
        }
      });
    });
  }

  function handleOrder(form) {
    Object.fromEntries(new FormData(form).entries());
    form.reset();
    const modal = form.closest('.modal');
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
    }
    showToast('Thanks! We will contact you shortly.');
  }


  function initLists() {
    if (!window.FloraApi || !window.FloraRender) return;
    loadTopSellers();
    loadTestimonials();
    loadBouquets({ reset: true });
    initBouquetsFilter();
    initLoadMore();
  }

  async function loadTopSellers() {
    const container = document.getElementById('bestsellers-list');
    if (!container) return;
    try {
      const items = await window.FloraApi.getTopSellers();
      window.FloraRender.renderTopSellers(container, items);
      initSliderFor(container);
    } catch (err) {
      window.FloraRender.renderMessage(
        container,
        'Could not load bestsellers. Please try again later.',
        'list-state--error'
      );
    } finally {
      container.setAttribute('aria-busy', 'false');
    }
  }

  async function loadTestimonials() {
    const container = document.getElementById('feedback-list');
    if (!container) return;
    try {
      const items = await window.FloraApi.getTestimonials();
      window.FloraRender.renderTestimonials(container, items);
      initSliderFor(container);
    } catch (err) {
      window.FloraRender.renderMessage(
        container,
        'Could not load testimonials.',
        'list-state--error'
      );
    } finally {
      container.setAttribute('aria-busy', 'false');
    }
  }

  function initSliderFor(track) {
    if (!window.FloraSlider) return;
    const root = track.closest('[data-slider]');
    if (root) window.FloraSlider.init(root);
  }

  async function loadBouquets({ reset = false } = {}) {
    const container = document.getElementById('bouquets-grid');
    const loadMore = document.querySelector('[data-load-more]');
    if (!container) return;

    if (reset) {
      STATE.bouquets.page = 1;
      STATE.bouquets.items = [];
      STATE.bouquets.done = false;
      container.innerHTML = '';
    }

    if (STATE.bouquets.loading || STATE.bouquets.done) return;
    STATE.bouquets.loading = true;
    container.setAttribute('aria-busy', 'true');
    if (loadMore) loadMore.disabled = true;

    const params = { _page: STATE.bouquets.page, _limit: STATE.bouquets.limit };
    if (STATE.bouquets.category && STATE.bouquets.category !== 'all') {
      params.category = STATE.bouquets.category;
    }

    try {
      const { items, total } = await window.FloraApi.getBouquets(params);
      STATE.bouquets.total = total;
      STATE.bouquets.items.push(...items);

      if (STATE.bouquets.items.length === 0) {
        window.FloraRender.renderMessage(
          container,
          'No bouquets match your filter.',
          'list-state--empty'
        );
        STATE.bouquets.done = true;
      } else {
        window.FloraRender.renderBouquets(container, items, { append: STATE.bouquets.page > 1 });
      }

      if (STATE.bouquets.items.length >= STATE.bouquets.total) {
        STATE.bouquets.done = true;
      } else {
        STATE.bouquets.page += 1;
      }

      updateLoadMoreVisibility();
    } catch (err) {
      window.FloraRender.renderMessage(
        container,
        'Could not load bouquets. Make sure json-server is running on port 3000.',
        'list-state--error'
      );
      if (loadMore) loadMore.hidden = true;
    } finally {
      STATE.bouquets.loading = false;
      container.setAttribute('aria-busy', 'false');
      if (loadMore && !loadMore.hidden) loadMore.disabled = false;
    }
  }

  function updateLoadMoreVisibility() {
    const btn = document.querySelector('[data-load-more]');
    if (!btn) return;
    btn.hidden = STATE.bouquets.done;
  }

  function initLoadMore() {
    const btn = document.querySelector('[data-load-more]');
    if (!btn) return;
    btn.addEventListener('click', () => loadBouquets());
  }

  function initBouquetsFilter() {
    const filter = document.querySelector('[data-bouquets-filter]');
    if (!filter) return;
    filter.addEventListener('change', event => {
      const target = event.target.closest('input[name="bouquets-category"]');
      if (!target) return;
      STATE.bouquets.category = target.value;
      loadBouquets({ reset: true });
    });
  }

  function showToast(text) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
  }
})();
