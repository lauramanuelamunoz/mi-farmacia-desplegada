import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './styles/index.css';

// Configuración de React Hot Toast
const toastConfig = {
  position: 'top-right',
  duration: 4000,
  style: {
    background: '#363636',
    color: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#4ade80',
      secondary: '#fff',
    },
  },
  error: {
    duration: 4000,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
  loading: {
    duration: 2000,
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#fff',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position={toastConfig.position}
        toastOptions={toastConfig}
      />
    </BrowserRouter>
  </React.StrictMode>
);