// /frontend/src/lib/api.ts (Atualizado)

import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333/api',
});

// Interceptor: Roda antes de CADA requisição
api.interceptors.request.use(
  (config) => {
    // 1. Pega o token do localStorage
    const token = localStorage.getItem('authToken');

    // 2. Se o token existir, adiciona ao cabeçalho da requisição
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);