import axios from 'axios';
import { toDateInput } from '../utils/date.js';
import API_BASE_URL from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Lấy danh sách tất cả phim
export const getAllMovies = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies`, {
      ...getAuthHeaders(),
      params,
    });
    return {
      data: response.data?.data || response.data || [],
      pagination: response.data?.pagination || null,
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// Lấy danh sách tất cả phim công khai (KHÔNG YÊU CẦU ĐĂNG NHẬP)
export const getPublicMovies = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/public/filter`, {
      params,
    });
    return {
      data: response.data?.data || response.data || [],
      pagination: response.data?.pagination || null,
    };
  } catch (error) {
    console.error('Error fetching public movies:', error);
    throw error;
  }
};

// Lấy danh sách năm phát hành phim
export const getMovieYears = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/years`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching movie years:', error);
    throw error;
  }
};

// Lấy thông tin phim theo ID
export const getMovieById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
};

// Tìm kiếm phim
export const searchMovies = async (query, { page = 1, limit = 10 } = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/search`, {
      params: { keyword: query, page, limit },
    });
    return {
      data: response.data?.data || response.data || [],
      pagination: response.data?.pagination || null,
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Lấy danh sách phim theo thể loại
export const getMoviesByGenre = async (genreId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/genre/${genreId}`);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

// Lấy danh sách phim theo quốc gia
export const getMoviesByCountry = async (countryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/country/${countryId}`);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching movies by country:', error);
    throw error;
  }
};

// Tạo phim mới (Chỉ dành cho Admin)
export const createMovie = async (movieData) => {
  try {
    const payload = {
      ...movieData,
      release_date: toDateInput(movieData.release_date),
    };

    const response = await axios.post(
      `${API_BASE_URL}/movies`,
      payload,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error;
  }
};

// Cập nhật thông tin phim (Chỉ dành cho Admin)
export const updateMovie = async (id, movieData) => {
  try {
    const payload = {
      ...movieData,
      release_date: toDateInput(movieData.release_date),
    };

    const response = await axios.put(
      `${API_BASE_URL}/movies/${id}`,
      payload,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

// Xóa phim (Chỉ dành cho Admin)
export const deleteMovie = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/movies/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};

// Tải lên ảnh đại diện và ảnh nền cho phim
export const uploadMovieImages = async (files = {}) => {
  try {
    const formData = new FormData();

    if (files.avatar) {
      formData.append('avatar', files.avatar);
    }
    if (files.background) {
      formData.append('background', files.background);
    }

    const response = await axios.post(
      `${API_BASE_URL}/upload/images`,
      formData,
      getAuthHeaders()
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading movie images:', error);
    throw error;
  }
};
// Tải lên tệp video phim để mã hóa (Encoding)
export const uploadMovieVideo = async (movieId, videoFile, onUploadProgress) => {
  try {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('movieId', movieId);

    const response = await axios.post(
      `${API_BASE_URL}/upload/video`,
      formData,
      {
        ...getAuthHeaders(),
        onUploadProgress,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading movie video:', error);
    throw error;
  }
};

// Ghi nhận một lượt xem phim
export const recordMovieView = async (id) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post(`${API_BASE_URL}/movies/${id}/view`, {}, { headers });
    return response.data;
  } catch (error) {
    // Không ném lỗi ra ngoài để tránh làm gián đoạn trải nghiệm người dùng nếu API view bị lỗi
    console.error('Error recording movie view:', error);
    return { success: false };
  }
};

