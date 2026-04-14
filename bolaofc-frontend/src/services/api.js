import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// Adiciona o token em cada requisição automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Certifique-se de que o nome é 'token'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;