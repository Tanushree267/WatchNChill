import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import Favorite from './pages/Favorite';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';//for showing toast messages
import Footer from './components/Footer';
import Login from './pages/login';
import About from './pages/About';
import Theaters from './pages/Theaters';
const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')//when page is on admin if we make admin 
  const isLoginRoute = useLocation().pathname === '/login'//when page is on login

  return (
    <>
      <Toaster />
      {!isLoginRoute && <Navbar />} {/* Hide Navbar on login page */}
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/theaters" element={<Theaters />} />
        <Route path='/About' element={<About />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      {!isLoginRoute && <Footer />} {/* Hide Footer on login page */}
    </>
  )
}

export default App