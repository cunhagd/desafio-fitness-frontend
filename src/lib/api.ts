// /frontend/src/lib/api.ts

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api';

export const api = axios.create({
  baseURL: baseURL,
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