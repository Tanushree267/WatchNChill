// src/pages/Movies.jsx
import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('http://localhost:3000/movies', { signal });

        // If response not ok, try to parse JSON error body safely,
        // otherwise throw a generic error.
        if (!res.ok) {
          let errMsg = 'Failed to fetch movies';
          try {
            const errBody = await res.json();
            errMsg = errBody.error || errBody.message || errMsg;
          } catch (parseErr) {
            // ignore JSON parse error, keep generic message
          }
          throw new Error(errMsg);
        }

        // safe to parse JSON now
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (err) {
        // If the fetch was aborted, do nothing
        if (err.name === 'AbortError') return;
        console.error('Movies fetch error', err);
        setError(err.message || 'Error fetching movies');
      } finally {
        // Only setLoading(false) if not aborted
        if (!signal.aborted) setLoading(false);
      }
    };

    load();

    return () => {
      // cancel the fetch on unmount
      controller.abort();
    };
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading movies…</div>;
  }
  if (error) {
    return <div className="min-h-[60vh] flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    movies.length > 0 ? (
      <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
        <h1 className="text-lg font-medium my-4">Now Showing</h1>
        <div className="flex flex-wrap max-sm:justify-center gap-4">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie._id} />
          ))}
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">No movies available</h1>
      </div>
    )
  );
};

export default Movies;