// src/pages/Theaters.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theaters } from '../assets/assets'; // uses the theaters export

const Theaters = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <h1 className="text-2xl font-semibold mb-6">Theaters & Locations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {theaters.map((city) => (
          <article
            key={city.id}
            className="bg-gray-900 rounded-2xl overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
            style={{ border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="h-56 md:h-64 w-full overflow-hidden">
              <img
                src={city.image}
                alt={city.city}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{city.city}</h2>
                  <p className="text-sm text-gray-400 mt-1">Top theaters in {city.city}</p>
                </div>

                <button
                  onClick={() => navigate(`/movies`)}
                  className="text-sm bg-primary px-3 py-1 rounded-full hover:opacity-90 transition"
                >
                  View Movies
                </button>
              </div>

              <ul className="mt-4 space-y-3">
                {city.theaters.map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <div className="h-3 w-3 rounded-full bg-primary mt-1" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.address}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Theaters;