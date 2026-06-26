(function () {
  'use strict';

  const modals = new Map();
  let triggerStack = [];
  let currentProduct = null;

  document.querySelectorAll('.modal').forEach(node => {
    const id = node.id;
    if (!id) return;
    modals.set(id, node);
  });

  document.addEventListener('click', event => {
    const opener = event.target.closest('[data-modal-open]');
    if (opener) {
      const id = `${opener.dataset.modalOpen}-modal`;
      open(id, opener);
      return;
    }
    const closer = event.target.closest('[data-modal-close]');
    if (closer) {
      close(closer.closest('.modal'));
    }
  });

  document.addEventListener('keydown', event => {
    const openModal = document.querySelector('.modal.is-open');
    if (openModal) {
      if (event.key === 'Escape') {
        close(openModal);
        return;
      }
      if (event.key === 'Tab') {
        trapTab(event, openModal);
        return;
      }
    }
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target;
      if (target.matches('[data-modal-open]') && target.tagName !== 'BUTTON' && target.tagName !== 'A') {
        event.preventDefault();
        target.click();
      }
    }
  });

  initQuantityControls();

  function open(id, trigger) {
    const modal = modals.get(id);
    if (!modal) return;

    const previouslyOpen = document.querySelector('.modal.is-open');
    if (previouslyOpen && previouslyOpen !== modal) {
      previouslyOpen.classList.remove('is-open');
      previouslyOpen.setAttribute('aria-hidden', 'true');
    }

    triggerStack.push(trigger);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');

    if (id === 'product-modal' && trigger) {
      fillProductModal(modal, trigger);
    }
    if (id === 'order-modal') {
      fillOrderModal(modal, trigger);
    }

    const focusable = modal.querySelector(
      'input:not([type="hidden"]), textarea, select, button:not([data-modal-close]):not([data-qty-dec]):not([data-qty-inc]), [href]'
    );
    if (focusable) focusable.focus({ preventScroll: true });
  }

  function close(modal) {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal.is-open')) {
      document.body.classList.remove('is-locked');
    }
    const trigger = triggerStack.pop();
    if (trigger) trigger.focus({ preventScroll: true });
  }

  function fillProductModal(modal, trigger) {
    const data = trigger.dataset;
    currentProduct = {
      name: data.bouquet || '',
      price: Number(data.price) || 0,
      desc: data.desc || '',
      photo: data.photo || '',
      photo2x: data.photo2x || data.photo || '',
      alt: data.alt || data.bouquet || '',
    };

    setText(modal, '[data-product-name]', currentProduct.name);
    setText(modal, '[data-product-price]', `$${currentProduct.price}`);
    setText(modal, '[data-product-desc]', currentProduct.desc);

    const img = modal.querySelector('[data-product-photo]');
    if (img) {
      img.src = currentProduct.photo;
      img.srcset = `${currentProduct.photo} 1x, ${currentProduct.photo2x} 2x`;
      img.alt = currentProduct.alt;
    }

    const buy = modal.querySelector('[data-product-buy]');
    if (buy) buy.dataset.bouquet = currentProduct.name;

    const qty = modal.querySelector('[data-qty-value]');
    if (qty) qty.textContent = '1';
  }

  function fillOrderModal(modal, trigger) {
    const tag = modal.querySelector('[data-order-bouquet]');
    if (!tag) return;
    const bouquet = (trigger && trigger.dataset.bouquet) || (currentProduct && currentProduct.name);
    if (bouquet) {
      const qtyValue = currentProduct
        ? document.querySelector('#product-modal [data-qty-value]')
        : null;
      const qty = qtyValue ? Number(qtyValue.textContent) || 1 : 1;
      const suffix = qty > 1 ? ` × ${qty}` : '';
      tag.innerHTML = `Bouquet: <strong>${escapeHtml(bouquet)}${suffix}</strong>`;
      tag.hidden = false;
    } else {
      tag.hidden = true;
      tag.innerHTML = '';
    }
  }

  function initQuantityControls() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    const value = modal.querySelector('[data-qty-value]');
    const dec = modal.querySelector('[data-qty-dec]');
    const inc = modal.querySelector('[data-qty-inc]');
    if (!value || !dec || !inc) return;

    dec.addEventListener('click', () => {
      const n = Math.max(1, (Number(value.textContent) || 1) - 1);
      value.textContent = String(n);
    });
    inc.addEventListener('click', () => {
      const n = Math.min(99, (Number(value.textContent) || 1) + 1);
      value.textContent = String(n);
    });
  }

  function setText(modal, selector, text) {
    const el = modal.querySelector(selector);
    if (el) el.textContent = text;
  }

  function getFocusable(modal) {
    return [...modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(el => el.offsetParent !== null || el === document.activeElement);
  }

  function trapTab(event, modal) {
    const list = getFocusable(modal);
    if (list.length === 0) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, ch => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
})();
