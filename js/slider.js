(function () {
  'use strict';

  function init(root) {
    const track = root.querySelector('[data-slider-track]');
    if (!track) return;
    const controls = root.parentElement.querySelector(
      `.slider__controls, [data-slider-controls="${root.dataset.slider}"]`
    );
    const dots = controls && controls.querySelector('[data-slider-dots]');
    const prev = controls && controls.querySelector('[data-slider-prev]');
    const next = controls && controls.querySelector('[data-slider-next]');

    let pages = 1;
    let activeIdx = 0;
    let isAnimating = false;

    function step() {
      const first = track.firstElementChild;
      if (!first) return track.clientWidth;
      const second = first.nextElementSibling;
      if (!second) return first.getBoundingClientRect().width;
      return second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    }

    function visible() {
      const s = step();
      if (!s) return 1;
      return Math.max(1, Math.round(track.clientWidth / s));
    }

    function pageCount() {
      const total = track.children.length;
      const v = visible();
      return Math.max(1, total - v + 1);
    }

    function update() {
      const s = step();
      activeIdx = s ? Math.round(track.scrollLeft / s) : 0;
      if (dots) {
        [...dots.children].forEach((dot, i) => {
          dot.classList.toggle('dots__item--active', i === activeIdx);
        });
      }
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        next.disabled = track.scrollLeft >= maxScroll - 1;
      }
    }

    function renderDots() {
      if (!dots) return;
      const n = pageCount();
      pages = n;
      if (n <= 1) {
        dots.innerHTML = '';
        dots.hidden = true;
        return;
      }
      dots.hidden = false;
      const want = [...Array(n)].map((_, i) =>
        `<li class="dots__item${i === activeIdx ? ' dots__item--active' : ''}" data-idx="${i}"></li>`
      ).join('');
      if (dots.children.length !== n) {
        dots.innerHTML = want;
      }
    }

    function go(idx) {
      const max = pageCount() - 1;
      const target = Math.max(0, Math.min(max, idx));
      track.scrollTo({ left: step() * target, behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', () => go(activeIdx - 1));
    if (next) next.addEventListener('click', () => go(activeIdx + 1));

    if (dots) {
      dots.addEventListener('click', event => {
        const li = event.target.closest('[data-idx]');
        if (!li) return;
        go(Number(li.dataset.idx));
      });
    }

    let rafId = 0;
    track.addEventListener('scroll', () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    });

    window.addEventListener('resize', () => {
      renderDots();
      update();
    });

    renderDots();
    update();

    return {
      refresh() {
        renderDots();
        update();
      },
    };
  }

  function initAll() {
    const sliders = document.querySelectorAll('[data-slider]');
    const map = new WeakMap();
    sliders.forEach(root => {
      const api = init(root);
      if (api) map.set(root, api);
    });
    return map;
  }

  window.FloraSlider = { init, initAll };
})();
