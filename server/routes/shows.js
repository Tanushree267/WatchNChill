// routes/shows.js
import express from 'express';
import Show from '../models/Show.js';
const router = express.Router();

/**
 * GET /shows?movieId=<movieId>
 * returns shows for a movie (list of show docs)
 */
router.get('/', async (req, res) => {
  try {
    const { movieId } = req.query;
    const filter = movieId ? { movie: movieId } : {};
    const shows = await Show.find(filter).sort({ showDateTime: 1 }).exec();
    return res.json({ success: true, shows });
  } catch (err) {
    console.error('GET /shows error', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;