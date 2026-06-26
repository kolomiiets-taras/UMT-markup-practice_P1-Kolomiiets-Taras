(function () {
  'use strict';

  const BASE_URL = 'http://localhost:3001';

  const client = window.axios
    ? window.axios.create({
        baseURL: BASE_URL,
        timeout: 8000,
      })
    : null;

  async function getBouquets(params = {}) {
    if (!client) throw new Error('axios is not loaded');
    const { data, headers } = await client.get('/bouquets', { params });
    const total = Number(headers['x-total-count']);
    return {
      items: data,
      total: Number.isFinite(total) ? total : data.length,
    };
  }

  async function getTopSellers() {
    if (!client) throw new Error('axios is not loaded');
    const { data } = await client.get('/topSellers');
    return data;
  }

  async function getTestimonials() {
    if (!client) throw new Error('axios is not loaded');
    const { data } = await client.get('/testimonials');
    return data;
  }

  window.FloraApi = {
    BASE_URL,
    getBouquets,
    getTopSellers,
    getTestimonials,
  };
})();
