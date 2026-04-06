import axios from 'axios';
import API_BASE_URL from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminStatistics = async (range = 'Tháng') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/statistics`, {
      ...getAuthHeaders(),
      params: { range },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    throw error;
  }
};

export const getRevenueHistory = async (page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/statistics/revenue-history`, {
      ...getAuthHeaders(),
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue history:', error);
    throw error;
  }
};

export const getPaymentSessions = async (page = 1, limit = 10, status = 'all') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/statistics/payment-sessions`, {
      ...getAuthHeaders(),
      params: { page, limit, status },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment sessions:', error);
    throw error;
  }
};
