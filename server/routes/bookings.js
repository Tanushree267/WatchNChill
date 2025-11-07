// server/routes/bookings.js
import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

const router = express.Router();

/**
 * POST /bookings
 * Body: { user: string (email), showId: ObjectId, amount: Number, bookedSeats: [ "A1", "A2" ], isPaid?: Boolean }
 */
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { user, showId, amount, bookedSeats = [], isPaid = false } = req.body || {};

    // basic validation
    if (!user || !showId || !amount || !Array.isArray(bookedSeats) || bookedSeats.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'user, showId, amount and bookedSeats are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(showId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Invalid showId' });
    }

    // load show inside the session
    const show = await Show.findById(showId).session(session);
    if (!show) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // occupiedSeats expected as array of strings
    const occupied = Array.isArray(show.occupiedSeats) ? show.occupiedSeats.slice() : [];

    // detect conflicts
    const conflictSeats = bookedSeats.filter(s => occupied.includes(s));
    if (conflictSeats.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ success: false, message: 'Some seats are already booked', conflictSeats });
    }

    // append new seats (avoid duplicates)
    const newOccupied = Array.from(new Set(occupied.concat(bookedSeats)));
    show.occupiedSeats = newOccupied;
    await show.save({ session });

    // create booking
    const [created] = await Booking.create(
      [
        {
          user,
          show: show._id,
          amount,
          bookedSeats,
          isPaid,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // populate booking for response (outside transaction)
    const populated = await Booking.findById(created._id)
      .populate({ path: 'show', populate: { path: 'movie', model: 'Movie' } })
      .exec();

    return res.status(201).json({ success: true, booking: populated });
  } catch (err) {
    console.error('Create booking error:', err);
    try { await session.abortTransaction(); } catch (e) {}
    session.endSession();
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

/**
 * GET /bookings?user=<email>
 * Returns bookings for the provided user (most recent first)
 */
router.get('/', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ success: false, message: 'user query param required' });

    const bookings = await Booking.find({ user })
      .populate({
        path: 'show',
        populate: { path: 'movie', model: 'Movie' }
      })
      .sort({ createdAt: -1 })
      .exec();

    return res.json({ success: true, bookings });
  } catch (err) {
    console.error('Fetch bookings error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

/**
 * DELETE /bookings/:id
 * Cancels a booking and frees associated seats (transactional).
 */
router.delete('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Invalid booking id' });
    }

    const booking = await Booking.findById(id).session(session);
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // load show and remove those seats from occupiedSeats
    const show = await Show.findById(booking.show).session(session);
    if (!show) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Show not found for this booking' });
    }

    // remove booked seats from show.occupiedSeats
    const occupied = Array.isArray(show.occupiedSeats) ? show.occupiedSeats.slice() : [];
    const remaining = occupied.filter(seat => !booking.bookedSeats.includes(seat));
    show.occupiedSeats = remaining;
    await show.save({ session });

    // delete booking
    await Booking.deleteOne({ _id: booking._id }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.json({ success: true, message: 'Booking cancelled and seats freed' });
  } catch (err) {
    console.error('Delete booking error:', err);
    try { await session.abortTransaction(); } catch (e) {}
    session.endSession();
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

export default router;