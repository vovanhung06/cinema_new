import { useState, useEffect } from "react";
import { getPublicMovies } from "../service/movie_service";

export const useFilter = () => {
  const [activeFilters, setActiveFilters] = useState({
    genre: "Tất cả",
    country: "Tất cả quốc gia",
    year: "Tất cả",
    sort: "Mới nhất",
  });

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // ===== MAP UI -> BE (Sắp xếp vẫn dùng map vì label khác key API) =====
  const sortMap = {
    'Mới nhất': 'new',
    'Cũ nhất': 'old',
    'Đánh giá cao': 'rating',
    'Xem nhiều nhất': 'views'
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMovies(page);
    }, 300);

    return () => clearTimeout(timeout);
  }, [activeFilters, page]);

  const fetchMovies = async (currentPage) => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: 12,
      };

      // ===== FILTER (Đã đồng bộ với DB nên dùng trực tiếp name) =====
      if (activeFilters.genre !== "Tất cả") {
        params.genre = activeFilters.genre;
      }

      if (activeFilters.country !== "Tất cả quốc gia") {
        params.country = activeFilters.country;
      }

      if (activeFilters.year !== "Tất cả") {
        params.year = activeFilters.year;
      }

      if (activeFilters.sort) {
        params.sort = sortMap[activeFilters.sort];
      }

      console.log("FILTER PARAMS:", params);

      const response = await getPublicMovies(params);
      const data = response.data || [];

      // ===== MAP DATA CHO MovieCard =====
      const mappedData = data.map(movie => ({
        ...movie,
        image: movie.avatar_url,
        year: movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : "",
        rating: movie.rating || null,
      }));

      setFilteredMovies(mappedData);
      setPagination(response.pagination || null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (type, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    setPage(1); // Reset to page 1 on filter change
  };

  return {
    activeFilters,
    filteredMovies,
    updateFilter,
    loading,
    page,
    setPage,
    pagination,
  };
};