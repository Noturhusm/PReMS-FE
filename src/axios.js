import axios from "axios";

const api = axios.create({
  baseURL: (process.env.REACT_APP_BASE_URL || "http://localhost:8000/api").replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

// Use an interceptor instead of a top-level constant
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;