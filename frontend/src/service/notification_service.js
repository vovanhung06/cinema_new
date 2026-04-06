import axios from "axios";
import API_BASE_URL from "../config/api";

const API = `${API_BASE_URL}/notifications`;

const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const getNotifications = async () => {
  return axios.get(API, getAuthHeaders());
};

export const getUnreadCount = async () => {
  return axios.get(`${API}/unread-count`, getAuthHeaders());
};

export const markAsRead = async (id) => {
  return axios.put(`${API}/${id}/read`, {}, getAuthHeaders());
};

export const markAllAsRead = async () => {
  return axios.put(`${API}/read-all`, {}, getAuthHeaders());
};

export const deleteReadNotifications = async () => {
  return axios.delete(`${API}/read`, getAuthHeaders());
};

export const deleteNotification = async (id) => {
  return axios.delete(`${API}/${id}`, getAuthHeaders());
};
