import { useState, useMemo, useEffect } from 'react';
import { getAllMovies, createMovie, updateMovie, deleteMovie } from '../service/movie_service';
import { getAllGenres } from '../service/genre_service';
import { getAllCountries } from '../service/country_service';

export function useMovies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Mới nhất');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [successType, setSuccessType] = useState('add');

  // Form data states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_date: '',
    avatar_url: '',
    background_url: '',
    movie_url: '',
    trailer_url: '',
    country_id: '',
    genre_ids: [],
    required_vip_level: 0
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [moviesData, genresData, countriesData] = await Promise.all([
          getAllMovies(),
          getAllGenres(),
          getAllCountries()
        ]);
        
        setMovies(moviesData);
        setGenres(genresData);
        setCountries(countriesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const filteredMovies = useMemo(() => {
    let result = [...movies];
    
    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.title.toLowerCase().includes(term) || 
        (m.genres && m.genres.toLowerCase().includes(term))
      );
    }

    // Sort
    if (sortBy === 'Mới nhất') {
      result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortBy === 'Lượt xem cao') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'Đánh giá cao') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [movies, searchTerm, sortBy]);

  const resetFormData = () => {
    setFormData({
      title: '',
      description: '',
      release_date: '',
      avatar_url: '',
      background_url: '',
      movie_url: '',
      trailer_url: '',
      country_id: '',
      genre_ids: [],
      required_vip_level: 0
    });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddMovie = async () => {
    try {
      setIsLoading(true);
      const newMovie = await createMovie(formData);
      setMovies(prev => [...prev, newMovie]);
      setSuccessType('add');
      setIsAddModalOpen(false);
      resetFormData();
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error('Error adding movie:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title || '',
      description: movie.description || '',
      release_date: movie.release_date || '',
      avatar_url: movie.avatar_url || '',
      background_url: movie.background_url || '',
      movie_url: movie.movie_url || '',
      trailer_url: movie.trailer_url || '',
      country_id: movie.country_id || '',
      genre_ids: movie.genre_ids || [],
      required_vip_level: movie.required_vip_level || 0
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMovie = async () => {
    try {
      setIsLoading(true);
      await updateMovie(selectedMovie.id, formData);
      setMovies(prev => prev.map(m => 
        m.id === selectedMovie.id 
          ? { ...m, ...formData } 
          : m
      ));
      setSuccessType('update');
      setIsEditModalOpen(false);
      resetFormData();
      setIsSuccessModalOpen(true);
      setSelectedMovie(null);
    } catch (err) {
      console.error('Error updating movie:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMovie = (id) => {
    const movie = movies.find(m => m.id === id);
    setMovieToDelete(movie);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteMovie = async () => {
    if (!movieToDelete) return;
    try {
      setIsLoading(true);
      await deleteMovie(movieToDelete.id);
      setMovies(prev => prev.filter(m => m.id !== movieToDelete.id));
      setSuccessType('delete');
      setIsDeleteConfirmOpen(false);
      setMovieToDelete(null);
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error('Error deleting movie:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setMovieToDelete(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    resetFormData();
  };

  const openAddModal = () => {
    resetFormData();
    setIsAddModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    resetFormData();
    setSelectedMovie(null);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return {
    movies: filteredMovies,
    genres,
    countries,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    isAddModalOpen,
    isEditModalOpen,
    isSuccessModalOpen,
    isDeleteConfirmOpen,
    selectedMovie,
    movieToDelete,
    successType,
    formData,
    handleFormChange,
    handleAddMovie,
    handleEditClick,
    handleUpdateMovie,
    handleDeleteMovie,
    confirmDeleteMovie,
    closeDeleteConfirm,
    closeAddModal,
    openAddModal,
    closeEditModal,
    closeSuccessModal,
  };
}
