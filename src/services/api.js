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

export async function fetchBars() {
  try {
    const response = await apiClient.get(API_ENDPOINTS.BARS);
    return response.data;
  } catch (error) {
    console.error('Error fetching bars:', error);
    return getDefaultBarsData();
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
    return response.data;
  } catch (error) {
    console.error('Error updating bar config:', error);
    throw error;
  }
}

function getDefaultBarsData() {
  return DEFAULT_BAR_LABELS.map((label, index) => ({
    id: index + 1,
    label,
    currentValue: DEFAULT_INITIAL_VALUES[index],
    swishNumber: DEFAULT_SWISH_NUMBERS[index],
    paypalUser: DEFAULT_PAYPAL_USERS[index],
  }));
}

function getDefaultConfig() {
  return {
    swishNumbers: DEFAULT_SWISH_NUMBERS,
    paypalUsers: DEFAULT_PAYPAL_USERS,
  };
}

