(function () {
  'use strict';

  // Switch source: 'json-server' (local mock on :3001) or 'backend' (Express API).
  // For production set window.FLORA_API or change DEFAULT_MODE to 'backend'.
  const DEFAULT_MODE = 'backend';

  const ENDPOINTS = {
    'json-server': {
      base: 'http://localhost:3001',
      bouquets: '/bouquets',
      topSellers: '/topSellers',
      testimonials: '/testimonials',
    },
    backend: {
      base: window.FLORA_API || 'http://localhost:3000/api',
      bouquets: '/bouquets',
      topSellers: '/bouquets?favorite=true&limit=6',
      testimonials: null,
    },
  };

  const mode = window.FLORA_API_MODE || DEFAULT_MODE;
  const cfg = ENDPOINTS[mode] || ENDPOINTS['json-server'];
  const BASE_URL = cfg.base;

  const client = window.axios
    ? window.axios.create({
        baseURL: BASE_URL,
        timeout: 8000,
      })
    : null;

  async function getBouquets(params = {}) {
    if (!client) throw new Error('axios is not loaded');
    const { data, headers } = await client.get(cfg.bouquets, { params });
    const total = Number(headers['x-total-count']);
    return {
      items: data,
      total: Number.isFinite(total) ? total : data.length,
    };
  }

  async function getTopSellers() {
    if (!client) throw new Error('axios is not loaded');
    const { data } = await client.get(cfg.topSellers);
    return data;
  }

  const STATIC_TESTIMONIALS = [
    { id: 1, quote: 'Flora made my anniversary unforgettable with their beautiful arrangement!', author: 'Emma T.' },
    { id: 2, quote: 'Absolutely stunning bouquet! It looked even better than the photo and arrived right on time.', author: 'Daniel R.' },
    { id: 3, quote: 'The service was exceptional, and the flowers were fresh!', author: 'Olivia M.' },
    { id: 4, quote: 'I keep coming back — every bouquet feels like a tiny piece of art.', author: 'Sophie L.' },
    { id: 5, quote: 'Their seasonal arrangements always impress my mom on her birthday.', author: 'Marcus K.' },
  ];

  async function getTestimonials() {
    if (!cfg.testimonials) return STATIC_TESTIMONIALS;
    if (!client) throw new Error('axios is not loaded');
    const { data } = await client.get(cfg.testimonials);
    return data;
  }

  window.FloraApi = {
    BASE_URL,
    getBouquets,
    getTopSellers,
    getTestimonials,
  };
})();
