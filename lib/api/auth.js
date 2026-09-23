import api from '../axios';

export const loginUser = (username, password) =>
  api.post('/auth/login', { username, password, expiresInMins: 30 });
