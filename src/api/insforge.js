import axios from 'axios';

const AUTH_BASE_URL = 'https://insforge-backend-740c116fd723.herokuapp.com/project';
const DB_BASE_URL = 'https://insforge-backend-740c116fd723.herokuapp.com/database';
const PROJECT_ID = import.meta.env.VITE_INSFORGE_PROJECT_ID;
const API_KEY = import.meta.env.VITE_INSFORGE_API_KEY;

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const dbApi = axios.create({
  baseURL: DB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  signUp: async (data) => {
    const response = await authApi.post(`/${PROJECT_ID}/sign-up`, data);
    return response.data;
  },
  
  login: async (data) => {
    const response = await authApi.post(`/${PROJECT_ID}/login`, data);
    return response.data;
  },
  
  verifyToken: async (token) => {
    const response = await authApi.post(`/${PROJECT_ID}/verify-token`, { token });
    return response.data;
  },
};

export const db = {
  createRecord: async (tableName, data) => {
    const response = await dbApi.post(`/tables/${tableName}/records`, [data]);
    return response.data;
  },
  
  getRecords: async (tableName, filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await dbApi.get(`/tables/${tableName}/records${params ? `?${params}` : ''}`);
    return response.data;
  },
  
  updateRecord: async (tableName, recordId, data) => {
    const response = await dbApi.patch(`/tables/${tableName}/records/${recordId}`, data);
    return response.data;
  },
  
  deleteRecord: async (tableName, recordId) => {
    const response = await dbApi.delete(`/tables/${tableName}/records/${recordId}`);
    return response.data;
  },
};