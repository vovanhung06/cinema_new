import { useState, useEffect } from 'react';
import { FILTER_MOVIES } from '../constants';

export const useFilter = () => {
  const [activeFilters, setActiveFilters] = useState({
    genre: 'Tất cả',
    year: 'Tất cả',
    country: 'Tất cả',
    sort: 'Mới nhất'
  });
  const [filteredMovies, setFilteredMovies] = useState(FILTER_MOVIES);

  useEffect(() => {
    let result = [...FILTER_MOVIES];
    
    if (activeFilters.genre !== 'Tất cả') {
      result = result.filter(m => m.genre === activeFilters.genre);
    }
    
    if (activeFilters.country !== 'Tất cả') {
      result = result.filter(m => m.country === activeFilters.country);
    }

    if (activeFilters.year !== 'Tất cả') {
      result = result.filter(m => m.year === activeFilters.year);
    }

    if (activeFilters.sort === 'Mới nhất') {
      result.sort((a, b) => b.year - a.year);
    } else if (activeFilters.sort === 'Đánh giá cao') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredMovies(result);
  }, [activeFilters]);

  const updateFilter = (type, value) => {
    setActiveFilters(prev => ({ ...prev, [type]: value }));
  };

  return { activeFilters, filteredMovies, updateFilter };
};
