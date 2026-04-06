import axios from 'axios';
import API_BASE_URL from '../config/api';

const API = `${API_BASE_URL}/ratings`;

const getAuthToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const submitRating = async (ratingData) => {
  return axios.post(`${API}/`, ratingData, getAuthHeaders());
};

export const getRatingsByMovie = async (movieId) => {
  return axios.get(`${API}/${movieId}`);
};

export const getUserRatingByMovie = async (movieId) => {
  return axios.get(`${API}/user/${movieId}`, getAuthHeaders());
};
