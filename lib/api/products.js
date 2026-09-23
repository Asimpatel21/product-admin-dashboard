import api from '../axios';

export const fetchProducts = ({ limit, skip, sortBy, order }) => {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || 'asc';
  }
  return api.get('/products', { params });
};

export const searchProducts = ({ q, limit, skip }) =>
  api.get('/products/search', { params: { q, limit, skip } });

// Note: DummyJSON's category endpoint doesn't support sortBy/order the same
// way /products does, but we pass them through in case a product list needs
// client-side fallback sorting later.
export const fetchByCategory = ({ category, limit, skip, sortBy, order }) => {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || 'asc';
  }
  return api.get(`/products/category/${category}`, { params });
};

export const fetchCategories = () => api.get('/products/categories');

export const fetchProductById = (id) => api.get(`/products/${id}`);

export const addProduct = (data) => api.post('/products/add', data);

export const editProduct = (id, data) => api.put(`/products/${id}`, data);

export const deleteProduct = (id) => api.delete(`/products/${id}`);
