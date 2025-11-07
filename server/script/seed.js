// server/scripts/seed.js
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import { movies } from '../data/movies.js';
import { shows } from '../data/shows.js';

// Ensure MONGODB_URI exists
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('❌ MONGODB_URI is not set in environment. Please set it in .env (do not commit real credentials).');
  process.exit(1);
}

// Normalize URI and append DB name if not present
let finalURI = mongoURI.trim();
// remove trailing slash if any
if (finalURI.endsWith('/')) finalURI = finalURI.slice(0, -1);

// If user already included a database name containing 'watchnchill', keep as-is
if (!finalURI.toLowerCase().includes('/watchnchill')) {
  finalURI = `${finalURI}/watchnchill`;
}

const run = async () => {
  try {
    // Connect to database
    await mongoose.connect(finalURI);
    console.log(`Connected for seeding: ${mongoose.connection.host} ${mongoose.connection.name}`);

    // Optional: clear collections first (so no duplicates)
    await Movie.deleteMany({});
    await Show.deleteMany({});

    // Insert movie documents
    const insertedMovies = await Movie.insertMany(movies);
    console.log(`Inserted ${insertedMovies.length} movies`);

    // Insert show documents
    const insertedShows = await Show.insertMany(shows);
    console.log(`Inserted ${insertedShows.length} shows`);

    // Close connection
    await mongoose.disconnect();
    console.log('✅ Seeding complete. Database disconnected.');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

run();