// src/contexts/SelectionContext.jsx
import React, { createContext, useContext, useState } from 'react';

const SelectionContext = createContext();

export function SelectionProvider({ children }) {
  const [selection, setSelection] = useState({
    movieId: null,        // store only movie id (string)
    showDateTime: null,   // selected date key (ISO date string) or null
    price: null,          // current show price (number) or null
    seats: [],            // selected seats array e.g. ["A1","A2"]
    showId: null          // the specific show id chosen (ObjectId string)
  });

  const clearSelection = () => setSelection({
    movieId: null,
    showDateTime: null,
    price: null,
    seats: [],
    showId: null
  });

  return (
    <SelectionContext.Provider value={{ selection, setSelection, clearSelection }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used inside SelectionProvider');
  return ctx;
}