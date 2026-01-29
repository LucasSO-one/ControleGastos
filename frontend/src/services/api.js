import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:5181") + "/api", 
});

api.interceptors.request.use((config) => {
  // 1. Tenta pegar o token salvo no navegador
  const token = localStorage.getItem("accessToken");

  // 2. Se o token existir, injeta no cabeçalho da requisição
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;