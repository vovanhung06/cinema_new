import { useState } from 'react';
import { statistics } from '../lib/mockData';

const { genres, topMovies } = statistics;

export function useStatistics() {
  const [timeRange, setTimeRange] = useState('Quý');

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return {
    genres,
    topMovies,
    timeRange,
    handleTimeRangeChange,
  };
}
