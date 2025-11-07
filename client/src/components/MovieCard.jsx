// src/components/MovieCard.jsx
import React from 'react';
import { StarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import timeFormat from '../lib/timeFormat';
import { useSelection } from '../contexts/SelectionContext.jsx';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { setSelection } = useSelection();

  function openDetailsAndSelect() {
    // store only movie id in selection (lightweight)
    setSelection(prev => ({
      ...prev,
      movieId: movie._id,   // <-- changed from storing full movie object
      showId: null,
      seats: [],
      price: null
    }));

    navigate(`/movies/${movie._id}`);
    window.scrollTo(0, 0);
  }

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-67">
      <img
        onClick={openDetailsAndSelect}
        src={movie.backdrop_path}
        alt={movie.title}
        className="rounded-lg h-65 w-full object-cover object-right-bottom cursor-pointer"
      />
      <p className="font-semibold mt-2 truncate">{movie.title}</p>
      <p className="text-gray-400 text-sm mt-2">
        {new Date(movie.release_date).getFullYear()} | {movie.genres?.slice(0,2).map(g => g.name).join(' | ')} | {timeFormat(movie.runtime)}
      </p>
      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={openDetailsAndSelect}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {Number(movie.vote_average).toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;