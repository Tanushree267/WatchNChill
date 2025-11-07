import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import React from 'react'; // make sure this is imported
import App from './App.jsx';
import './index.css';
import { AppContextProvider } from './context/AppContext.jsx';
import { SelectionProvider } from './contexts/SelectionContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <SelectionProvider>
          <App />
        </SelectionProvider>
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);