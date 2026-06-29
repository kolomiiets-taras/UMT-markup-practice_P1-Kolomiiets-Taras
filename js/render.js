(function () {
  'use strict';

  function escape(str) {
    return String(str).replace(/[&<>"']/g, ch => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function bouquetCard(item, modifier) {
    const sizes = modifier === 'tall'
      ? { w: 432, h: 432 }
      : { w: 320, h: 320 };
    const name = item.name || item.title || '';
    const photo = item.photo || item.photoURL || '';
    const photo2x = item.photo2x || photo;
    const alt = item.alt || name;
    return `
      <li>
        <article
          class="product-card${modifier ? ` product-card--${modifier}` : ''}"
          data-id="${item.id}"
          data-modal-open="product"
          data-bouquet="${escape(name)}"
          data-price="${item.price}"
          data-desc="${escape(item.description || '')}"
          data-photo="${escape(photo)}"
          data-photo2x="${escape(photo2x)}"
          data-alt="${escape(alt)}"
          role="button"
          tabindex="0"
          aria-label="View ${escape(name)} details"
        >
          <div class="product-card__media">
            <img
              src="${escape(photo)}"
              srcset="${escape(photo)} 1x, ${escape(photo2x)} 2x"
              alt="${escape(alt)}"
              width="${sizes.w}"
              height="${sizes.h}"
              loading="lazy"
              decoding="async">
          </div>
          <h3 class="product-card__title">${escape(name)}</h3>
          <p class="product-card__desc">${escape(item.description || '')}</p>
          <p class="product-card__price">$${item.price}</p>
        </article>
      </li>`;
  }

  function testimonialCard(item) {
    return `
      <li class="testimonial" data-id="${item.id}">
        <p class="testimonial__quote">&ldquo;${escape(item.quote)}&rdquo;</p>
        <p class="testimonial__author">${escape(item.author)}</p>
      </li>`;
  }

  function renderList(container, items, builder, { append = false } = {}) {
    if (!container) return;
    const html = items.map(builder).join('');
    if (append) {
      container.insertAdjacentHTML('beforeend', html);
    } else {
      container.innerHTML = '';
      container.insertAdjacentHTML('beforeend', html);
    }
  }

  function renderBouquets(container, items, { append = false } = {}) {
    renderList(container, items, item => bouquetCard(item), { append });
  }

  function renderTopSellers(container, items) {
    renderList(container, items, item => bouquetCard(item, 'tall'));
  }

  function renderTestimonials(container, items) {
    renderList(container, items, testimonialCard);
  }

  function renderMessage(container, text, modifier = '') {
    if (!container) return;
    container.innerHTML = `
      <li class="list-state ${modifier}">${escape(text)}</li>
    `;
  }

  window.FloraRender = {
    renderBouquets,
    renderTopSellers,
    renderTestimonials,
    renderMessage,
  };
})();
