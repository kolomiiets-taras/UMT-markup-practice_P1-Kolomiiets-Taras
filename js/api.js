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
      testimonials: '/testimonials',
      orders: '/orders',
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

  async function getTestimonials() {
    if (!client) throw new Error('axios is not loaded');
    const { data } = await client.get(cfg.testimonials);
    return data;
  }

  async function createOrder(payload) {
    if (!client) throw new Error('axios is not loaded');
    if (!cfg.orders) throw new Error('Orders endpoint is not available in this mode');
    const { data } = await client.post(cfg.orders, payload);
    return data;
  }

  window.FloraApi = {
    BASE_URL,
    getBouquets,
    getTopSellers,
    getTestimonials,
    createOrder,
  };
})();
