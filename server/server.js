// server/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';

import moviesRouter from './routes/movies.js';
import showsRouter from './routes/shows.js';
import bookingsRouter from './routes/bookings.js';
import authRouter from './routes/auth.js'; // <-- new auth routes

const app = express();
const port = 3000;

// connect to MongoDB
await connectDB();

// middleware
app.use(express.json());

// CORS setup (only frontend origin for dev)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// routes
app.use('/movies', moviesRouter);
app.use('/shows', showsRouter);
app.use('/bookings', bookingsRouter);
app.use('/auth', authRouter); // register & login routes

// root route
app.get('/', (req, res) => {
  res.send('🎬 WatchChill server is running successfully');
});

// start server
app.listen(port, () => console.log(`✅ Server running at http://localhost:${port}`));