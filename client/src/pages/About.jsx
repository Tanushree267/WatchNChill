// src/pages/About.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const About = () => {
    const navigate = useNavigate();

    return (
        // Adjusted padding top for a slightly lower start
        <div className="px-6 md:px-16 lg:px-40 pt-36 md:pt-48 min-h-[80vh]">

            {/* --- Header Section --- */}
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
                    Welcome to <span className="text-primary">Watch & Chill</span>
                </h1>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"> {/* Changed items-start to items-center for better vertical alignment */}

                {/* Right: Text & Narrative (Order 1 on small screens, 2 on medium) */}
                <div className="order-1 md:order-2 p-4">
                    <h2 className="text-2xl font-bold mb-4 border-b border-primary/30 pb-2">
                        🎬 Our Vision: Movie.Magic.Moments
                    </h2>

                    <p className="text-gray-300 mb-6 text-md leading-relaxed">
                        Watch & Chill is built for people who love the theatre experience but hate the hassle of booking. We've meticulously crafted every step to be simple, fast, and reliable. You choose a movie, pick a showtime, select seats—that's it. We aim for a smooth, joyful journey from browsing to booking, with absolutely no complicated flows or distractions.
                    </p>

                    <p className="text-sm text-gray-400 mb-8 italic border-l-4 border-primary pl-4">
                        Welcome to Watch & Chill, where movie plans don't feel like homework.
                        One tap, a little tech magic, and boom-seats secured ✨
                        No drama, no chaos, just pure cinematic vibes and smooth-as-butter booking🧈🎬
                        
                    </p>

                    {/* Feature Grid - Reduced to two features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">

                        {/* Feature 1 */}
                        <div className="bg-[#15202b] p-5 rounded-xl border border-primary/10 transition-all duration-300 hover:bg-[#1a2c3a] shadow-lg">
                            <h3 className="font-semibold text-lg text-white">Focus on Booking</h3>
                            <p className="text-xs text-gray-400 mt-1">Minimal steps to secure your seats maximum enjoyment.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-[#15202b] p-5 rounded-xl border border-primary/10 transition-all duration-300 hover:bg-[#1a2c3a] shadow-lg">
                            <h3 className="font-semibold text-lg text-white">Local Data Driven</h3>
                            <p className="text-xs text-gray-400 mt-1">Uses simple, local data for easy understanding and stable demos.</p>
                        </div>
                    </div>

                    {/* Call to Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-6">
                        <button
                            onClick={() => navigate('/movies')}
                            className="px-6 py-3 rounded-full bg-primary hover:bg-primary-darker text-white font-medium transition duration-300 shadow-md shadow-primary/40"
                        >
                            Start Browsing Films →
                        </button>

                        {/* Changed the Contact Us button style to match the primary button color */}
                        <a
                            href="#contact"
                            className="px-6 py-3 rounded-full bg-primary hover:bg-primary-darker text-white font-medium transition duration-300 shadow-md shadow-primary/40 flex items-center"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>


                {/* Left: Image (Order 2 on small screens, 1 on medium) */}
                <div className="order-2 md:order-1 flex items-center">
                    <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl shadow-gray-950/70 border border-primary/10 w-full">

                        {/* Image Container with fixed height for better alignment on large screens */}
                        <div className="h-[400px] w-full overflow-hidden bg-gray-950">
                            <img
                                src={assets.aboutImage}
                                alt="A stylish, dark-themed cinema interior or artwork"
                                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                            />
                        </div>


                        {/* Short Banner / Caption */}
                        <div className="p-4 border-t border-primary/20 bg-[#0f1720]">
                            <p className="text-sm text-gray-400 text-center">
                                Less booking steps, more popcorn moments 🎬

                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* --- Optional Contact Footer Section --- */}
            <div id="contact" className="max-w-5xl mx-auto mt-20 p-8 bg-[#071018] rounded-2xl border border-primary/20 text-center shadow-lg">
                <h4 className="text-2xl font-semibold mb-3 text-white">Get in Touch 👋</h4>
                <p className="text-md text-gray-400 mb-3">
                    For feedback, project demos, or questions about the code, send us a message.
                </p>
                <p className="text-lg text-primary font-medium">
                    team@watchnchill.example
                </p>
                <p className="text-xs text-gray-600 mt-4">Built with dedication for learning and portfolio purposes.</p>
            </div>
        </div>
    );
};

export default About;