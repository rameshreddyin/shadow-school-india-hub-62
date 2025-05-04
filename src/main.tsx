import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove console logs in production
if (import.meta.env.PROD) {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  
  // Keep error and warning for critical issues
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args) => {
    // Could send to error logging service here
    originalError(...args);
  };
  
  console.warn = (...args) => {
    // Could filter out noisy warnings here
    originalWarn(...args);
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
