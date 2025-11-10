import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API endpoints
export const marketAPI = {
  getOverview: () => api.get('/api/market/overview'),
  getSize: () => api.get('/api/market/size'),
  getForecasts: () => api.get('/api/forecasts'),
};

export const pricingAPI = {
  getPricing: () => api.get('/api/pricing'),
};

export const competitorAPI = {
  getCompetitors: () => api.get('/api/competitors'),
};

export const regionalAPI = {
  getRegional: () => api.get('/api/regional'),
};

export const serviceAPI = {
  getServices: () => api.get('/api/services'),
};

export const trendAPI = {
  getTrends: () => api.get('/api/trends'),
};

export const dashboardAPI = {
  getSummary: () => api.get('/api/dashboard/summary'),
};

export const refreshData = () => api.post('/api/refresh');

export default api;
