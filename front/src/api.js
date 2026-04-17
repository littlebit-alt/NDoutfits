import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ndoutfits.onrender.com/api',
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('dzshark_token');
  if (token) config.headers.Authorization = 'Bearer ${token}';
  return config;
});

export default API;