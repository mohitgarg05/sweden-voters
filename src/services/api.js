import axios from 'axios';
import {
  API_BASE_URL,
  API_ENDPOINTS,
  DEFAULT_BAR_LABELS,
  DEFAULT_INITIAL_VALUES,
  DEFAULT_SWISH_NUMBERS,
  DEFAULT_PAYPAL_USERS,
} from '../constants/config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const transformBar = (bar) => ({
  id: bar._id || bar.id,
  _id: bar._id,
  label: bar.label,
  currentValue: bar.currentValue,
  swishNumber: bar.swishNumber,
  paypalUser: bar.paypalUser,
  isActive: bar.isActive,
  order: bar.order,
  color: bar.color,
  about: bar.about,
});

export async function fetchBars() {
  try {
    const response = await apiClient.get(API_ENDPOINTS.BARS);
    const bars = Array.isArray(response.data) ? response.data : [];
    return bars.map(transformBar);
  } catch (error) {
    console.error('Error fetching bars:', error);
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      console.warn('Backend not available, using default data');
      return getDefaultBarsData();
    }
    throw error;
  }
}

export async function addDonation(barId, amount) {
  try {
    const response = await apiClient.post(API_ENDPOINTS.DONATIONS, {
      barId,
      amount,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding donation:', error);
    throw error;
  }
}

export async function fetchConfig() {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CONFIG);
    return response.data;
  } catch (error) {
    console.error('Error fetching config:', error);
    return getDefaultConfig();
  }
}

export async function updateBarConfig(barId, config) {
  try {
    const response = await apiClient.put(`${API_ENDPOINTS.BARS}/${barId}`, config);
    return transformBar(response.data);
  } catch (error) {
    console.error('Error updating bar config:', error);
    throw error;
  }
}

export async function fetchBarsAdmin() {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.BARS}/admin`);
    const bars = Array.isArray(response.data) ? response.data : [];
    return bars.map(transformBar);
  } catch (error) {
    console.error('Error fetching bars:', error);
    throw error;
  }
}

export async function createBar(barData) {
  try {
    const response = await apiClient.post(API_ENDPOINTS.BARS, barData);
    return transformBar(response.data);
  } catch (error) {
    console.error('Error creating bar:', error);
    throw error;
  }
}

export async function updateBar(barId, barData) {
  try {
    const response = await apiClient.put(`${API_ENDPOINTS.BARS}/${barId}`, barData);
    return transformBar(response.data);
  } catch (error) {
    console.error('Error updating bar:', error);
    throw error;
  }
}

export async function deleteBar(barId) {
  try {
    const response = await apiClient.delete(`${API_ENDPOINTS.BARS}/${barId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting bar:', error);
    throw error;
  }
}

export async function fetchDonations(params = {}) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DONATIONS, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
}

export async function fetchDonationStats(params = {}) {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.DONATIONS}/stats`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    throw error;
  }
}

export async function login(username, password) {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.AUTH}/login`, {
      username,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function verifyAuth() {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.AUTH}/verify`);
    return response.data;
  } catch (error) {
    localStorage.removeItem('adminToken');
    throw error;
  }
}

export function logout() {
  localStorage.removeItem('adminToken');
}

export function getAuthToken() {
  return localStorage.getItem('adminToken');
}

export async function createSwishPaymentIntent(barId, amount) {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.STRIPE}/create-payment-intent`, {
      barId,
      amount,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function createPayPalPaymentIntent(barId, amount) {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.STRIPE}/create-paypal-payment-intent`, {
      barId,
      amount,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating PayPal payment intent:', error);
    throw error;
  }
}

export async function verifyPaymentStatus(paymentIntentId) {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.STRIPE}/verify-payment/${paymentIntentId}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment status:', error);
    throw error;
  }
}

function getDefaultBarsData() {
  return DEFAULT_BAR_LABELS.map((label, index) => ({
    id: index + 1,
    _id: `temp-${index + 1}`,
    label,
    currentValue: DEFAULT_INITIAL_VALUES[index],
    swishNumber: DEFAULT_SWISH_NUMBERS[index],
    paypalUser: DEFAULT_PAYPAL_USERS[index],
    isActive: true,
    order: index + 1,
  }));
}

function getDefaultConfig() {
  return {
    swishNumbers: DEFAULT_SWISH_NUMBERS,
    paypalUsers: DEFAULT_PAYPAL_USERS,
  };
}

