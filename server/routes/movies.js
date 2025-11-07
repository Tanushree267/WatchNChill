// routes/movies.js
import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

// GET /movies  -> list all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ release_date: -1 }).exec();
    return res.json({ success: true, movies });
  } catch (err) {
    console.error('GET /movies error', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /movies/:id -> single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).exec();
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    return res.json({ success: true, movie });
  } catch (err) {
    console.error('GET /movies/:id error', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;