 import axios from "axios";

const API = "http://localhost:3000/api/users";

const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

// GET PROFILE
export const getProfile = async () => {
  return axios.get(`${API}/me`, getAuthHeaders());
};

// UPDATE PROFILE
export const updateProfile = async (data) => {
  return axios.put(
    `${API}/me/update`,
    {
      username: data.username,
    },
    getAuthHeaders()
  );
};

export const changePassword = async (data) => {
  return axios.put(
    `${API}/me/change-password`,
    {
      oldPass: data.oldPass,
      newPass: data.newPass,
    },
    getAuthHeaders()
  );
};