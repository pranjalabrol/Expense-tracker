import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Automatically add token to headers for authenticated requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;
