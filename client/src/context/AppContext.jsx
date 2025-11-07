import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(false);

  // ⭐ new: favorites
  const [favorites, setFavorites] = useState([]);

  // toggle favorites
  const toggleFavorite = (movie) => {
    if (!movie?._id) return;
    setFavorites((prev) => {
      const exists = prev.find((m) => String(m._id) === String(movie._id));
      if (exists) {
        return prev.filter((m) => String(m._id) !== String(movie._id));
      } else {
        // store the entire movie object (clean and simple)
        return [movie, ...prev];
      }
    });
  };


  const value = { navigate, user, setUser, favorites, toggleFavorite };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};