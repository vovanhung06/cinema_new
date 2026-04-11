let API_BASE_URL = import.meta.env.VITE_API_URL;

// Nếu không có VITE_API_URL (ví dụ build trên hosting mà quên set env)
// Ưu tiên dùng đường dẫn tương đối '/api' cho production (dùng cho Nginx/Docker hoặc proxy cùng domain)
if (!API_BASE_URL) {
  API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';
}

// Chuẩn hóa: bỏ dấu gạch chéo dư thừa ở cuối
if (API_BASE_URL && API_BASE_URL !== '/' && API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

// Đảm bảo luôn có tiền tố /api ở cuối
if (API_BASE_URL && API_BASE_URL !== '/api' && !API_BASE_URL.endsWith('/api') && !API_BASE_URL.includes('localhost')) {
  API_BASE_URL = `${API_BASE_URL}/api`;
}

export default API_BASE_URL;
