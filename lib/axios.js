import axios from 'axios';

// One shared Axios instance for the whole app.
// Every request gets the token attached here, and every error is
// normalized here, so no component has to deal with that itself.
const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the token is invalid/expired, kick the user back to login.
    if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';

    return Promise.reject({ ...error, message });
  }
);

export default api;
