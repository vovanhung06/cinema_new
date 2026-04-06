let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Đảm bảo luôn có tiền tố /api ở cuối nếu là URL production và đang thiếu
if (API_BASE_URL && !API_BASE_URL.endsWith('/api') && !API_BASE_URL.includes('localhost')) {
  API_BASE_URL = API_BASE_URL.endsWith('/') ? `${API_BASE_URL}api` : `${API_BASE_URL}/api`;
}

export default API_BASE_URL;
