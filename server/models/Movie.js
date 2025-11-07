// models/Movie.js
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, required: true },
    backdrop_path: { type: String, required: true },
    release_date: { type: String, required: true },
    tagline: { type: String },
    genres: { type: Array, required: true },
    vote_average: { type: Number, required: true },
    runtime: { type: Number, required: true },
    trailer: { type: String }, 
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;