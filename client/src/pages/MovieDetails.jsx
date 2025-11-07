import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';
import { useSelection } from '../contexts/SelectionContext.jsx';
import { useAppContext } from '../context/AppContext'; // <-- added

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [dateMap, setDateMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setSelection } = useSelection();
  const { favorites, toggleFavorite } = useAppContext(); // <-- added

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadMovie = async () => {
      try {
        setLoading(true);
        setError(null);

        // fetch movie info
        const resMovie = await fetch(`http://localhost:3000/movies/${id}`, { signal });

        if (!resMovie.ok) {
          let errMsg = 'Movie not found';
          try {
            const body = await resMovie.json();
            errMsg = body.error || body.message || errMsg;
          } catch (e) {
            // ignore JSON parse error
          }
          throw new Error(errMsg);
        }

        const movieData = await resMovie.json();
        if (!movieData?.movie) throw new Error('Movie not found in response');

        // local movie state
        setMovie(movieData.movie);

        // set selection to store only movieId (lightweight)
        setSelection(prev => ({
          ...prev,
          movieId: movieData.movie._id,
          showDateTime: prev.showDateTime ?? null,
          price: prev.price ?? null,
          seats: prev.seats ?? [],
          showId: prev.showId ?? null
        }));

        // fetch shows for that movie
        const resShows = await fetch(`http://localhost:3000/shows?movieId=${id}`, { signal });
        if (!resShows.ok) {
          let errMsg = 'No shows found';
          try {
            const body = await resShows.json();
            errMsg = body.error || body.message || errMsg;
          } catch (e) {
            // ignore
          }
          throw new Error(errMsg);
        }

        const showData = await resShows.json();
        const showsArr = showData.shows || [];

        // group shows by date (YYYY-MM-DD)
        const grouped = showsArr.reduce((acc, show) => {
          const dateKey = new Date(show.showDateTime).toISOString().split('T')[0];
          acc[dateKey] = acc[dateKey] || [];
          acc[dateKey].push(show);
          return acc;
        }, {});

        setDateMap(grouped);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('MovieDetails load error:', err);
        setError(err.message || 'Error loading movie details');
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    loadMovie();

    return () => {
      controller.abort();
    };
  }, [id, setSelection]);

  // Smooth scroll when clicking "Buy Tickets"
  const handleBuyTicketsClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('dateSelect');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 700, behavior: 'smooth' });
    }
  };

  // is this movie in favorites?
  const isFav = movie && favorites.some(f => String(f._id) === String(movie._id));

  // open trailer in new tab if available
  const openTrailer = () => {
    if (movie?.trailer) {
      try { window.open(String(movie.trailer), '_blank', 'noopener,noreferrer'); } catch (e) { console.error(e); }
    } else {
      // fallback: keep original behaviour (no change in design)
      alert('Trailer not available');
    }
  };

  if (loading) return <div className="text-center mt-40 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-40 text-red-500">{error}</div>;
  if (!movie) return <div className="text-center mt-40">Movie not found</div>;

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <p className="text-primary">English</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {movie.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {Number(movie.vote_average).toFixed(1)} User Ratings
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {movie.overview}
          </p>

          <p>
            {timeFormat(movie.runtime)} .{' '}
            {movie.genres?.map((g) => g.name).join(', ')} .{' '}
            {movie.release_date?.split('-')[0]}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button
              onClick={openTrailer}
              className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>

            <a
              href="#dateSelect"
              onClick={handleBuyTicketsClick}
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>

            <button
              onClick={() => toggleFavorite(movie)}
              className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'text-primary fill-primary' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div id="dateSelect" className="mt-16">
        <DateSelect dateTime={dateMap} id={id} />
      </div>
    </div>
  );
};

export default MovieDetails;