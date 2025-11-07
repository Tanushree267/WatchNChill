// src/pages/MyBookings.jsx
import React, { useEffect, useState } from "react";
import timeFormat from "../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const { user } = useAppContext();
  const navigate = useNavigate();

  const getMovieFromBooking = (item) => {
    return item.movie || item.show?.movie || {};
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      if (!user?.email) {
        setBookings([]);
        return;
      }

      const res = await fetch(`http://localhost:3000/bookings?user=${encodeURIComponent(user.email)}`);
      const data = await res.json();

      if (res.ok && data?.success) setBookings(data.bookings || []);
      else if (Array.isArray(data)) setBookings(data);
      else setBookings(data?.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      setBookings([]);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const handleCancel = async (bookingId) => {
    if (!bookingId) return;
    const ok = window.confirm("Are you sure you want to cancel this booking? This will free the seats.");
    if (!ok) return;

    try {
      setDeletingId(bookingId);
      const res = await fetch(`http://localhost:3000/bookings/${bookingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        setBookings((prev) => prev.filter((b) => String(b._id) !== String(bookingId)));
        toast.success("Booking cancelled");
      } else {
        toast.error(data?.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Cancel error", err);
      toast.error("Server error while cancelling");
    } finally {
      setDeletingId(null);
    }
  };

  if (!user?.email) {
    return (
      <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-2">You are not signed in</h2>
        <p className="text-gray-400 mb-4">Please login to view your bookings.</p>
        <button onClick={() => navigate("/login")} className="px-6 py-2 bg-primary text-white rounded">
          Go to Login
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <h1 className="text-lg font-semibold mb-4">My Booking</h1>

      {bookings.length === 0 && <p className="text-gray-400">No bookings found.</p>}

      {bookings.map((item, index) => {
        const movie = getMovieFromBooking(item);
        const poster = movie?.poster || movie?.poster_path || movie?.backdrop_path || "";
        const showDateTime = item.show?.showDateTime || item.showDateTime || item.createdAt || null;

        return (
          <div
            key={item._id ?? index}
            className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
          >
            <div className="flex flex-col md:flex-row">
              <img
                src={poster}
                alt={movie?.title || ""}
                className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
                onError={(e) => { e.currentTarget.src = ""; }}
              />
              <div className="flex flex-col p-4">
                <p className="text-lg font-semibold">{movie?.title || "Untitled"}</p>
                <p className="text-gray-400 text-sm">{timeFormat(movie?.runtime)}</p>
                <p className="text-gray-400 text-sm mt-auto">{showDateTime ? dateFormat(showDateTime) : "—"}</p>
              </div>
            </div>

            <div className="flex flex-col md:items-end md:text-right justify-between p-4">
              <div className="flex items-center gap-3 mb-3">
                <p className="text-2xl font-semibold">{currency}{item.amount}</p>

                {!item.isPaid && (
                  <button
                    className="bg-primary px-4 py-1.5 text-sm rounded-full font-medium cursor-pointer hover:opacity-90 transition"
                    onClick={() => alert("Pay Now clicked (not implemented)")}
                  >
                    Pay Now
                  </button>
                )}

                <button
                  onClick={() => handleCancel(item._id)}
                  disabled={deletingId === item._id}
                  className={`${deletingId === item._id ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"} bg-primary px-4 py-1.5 text-sm rounded-full font-medium cursor-pointer transition`}
                >
                  {deletingId === item._id ? "Cancelling..." : "Cancel Booking"}
                </button>
              </div>

              <div className="text-sm">
                <p><span className="text-gray-400">Total Tickets: </span>{(item.bookedSeats || []).length}</p>
                <p><span className="text-gray-400">Seat Number: </span>{(item.bookedSeats || []).join(", ")}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookings;