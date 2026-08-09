import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || "https://taskpod-teal.vercel.app";
const baseURL = rawUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
