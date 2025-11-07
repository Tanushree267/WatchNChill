// src/components/DateSelect.jsx
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelection } from '../contexts/SelectionContext.jsx';

const DateSelect = ({ dateTime = {}, id }) => {
  const navigate = useNavigate();
  const { selection, setSelection } = useSelection();

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(null);
  }, [id]);

  function handlePickDate(dateKey) {
    setSelected(dateKey);

    // derive a sensible price: take first show's price for that date if available
    const entry = dateTime?.[dateKey];
    let price = null;
    if (Array.isArray(entry) && entry.length > 0) price = entry[0].showPrice ?? null;
    else if (entry && entry.showPrice) price = entry.showPrice;
    else price = null;

    // set selection using movieId (not whole movie). Preserve existing movieId if present.
    setSelection(prev => ({
      ...prev,
      movieId: prev.movieId ?? id,
      showDateTime: dateKey,
      price,
      seats: [],
      showId: null
    }));

    
  }

  const onBookHandler = () => {
    if (!selected) {
      return toast.error('Please select a date');
    }

    // pick the first showId of the selected date as default showId (user will choose seats/time in SeatLayout)
    const showsForDate = dateTime[selected] || [];
    const defaultShowId = showsForDate.length ? showsForDate[0]._id : null;
    const price = showsForDate.length ? showsForDate[0].showPrice : (selection.price ?? null);

    setSelection(prev => ({
      ...prev,
      movieId: prev.movieId ?? id,
      showDateTime: selected,
      price,
      seats: [],
      showId: defaultShowId
    }));

    // navigate to seat layout path you already use:
    navigate(`/movies/${id}/${encodeURIComponent(selected)}`);
    window.scrollTo(0, 0);
  };

  // dateTime keys sorted ascending
  const dateKeys = Object.keys(dateTime).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div id="dateSelect" className="pt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
        <div>
          <p className="text-lg font-semibold">Choose Date</p>
          <div className="flex items-center gap-6 text-sm mt-5">
            <ChevronLeftIcon width={28} />
            <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
              {dateKeys.map((date) => (
                <button
                  onClick={() => handlePickDate(date)}
                  key={date}
                  className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${selected === date ? "bg-primary text-white" : "border border-primary/70"}`}
                >
                  <span>{new Date(date).getDate()}</span>
                  <span>{new Date(date).toLocaleDateString('en-US', { month: 'short' })}</span>
                </button>
              ))}
            </span>
            <ChevronRightIcon width={28} />
          </div>
        </div>

        <button onClick={onBookHandler} className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DateSelect;

// helper export (you had this before)
export const dateFormat = (date) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};