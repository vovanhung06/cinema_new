import axios from "axios";
import API_BASE_URL from "../config/api";

const API = `${API_BASE_URL}/vip`;

const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const upgradeVip = async () => {
    return axios.post(`${API}/upgrade`, {}, getAuthHeaders());
};

export const getVipPackages = async () => {
    return axios.get(`${API}/`);
};

export const getVipHistory = async () => {
    return axios.get(`${API}/history`, getAuthHeaders());
};

export const cancelVip = async () => {
    return axios.post(`${API}/cancel`, {}, getAuthHeaders());
};
