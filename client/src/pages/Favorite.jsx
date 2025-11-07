// src/pages/Favourite.jsx
import React from 'react';
import MovieCard from '../components/MovieCard';
import { useAppContext } from '../context/AppContext';

const Favourite = () => {
  const { favorites } = useAppContext();

  return favorites && favorites.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] '>
      <h1 className='text-lg font-medium my-4'>Your Favourite Movies</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {favorites.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>NO movies available </h1>
    </div>
  );
}

export default Favourite;