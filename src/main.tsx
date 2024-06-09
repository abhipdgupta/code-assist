import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadApiKey } from './utils/apiKey.ts';

loadApiKey().then(() => {
    console.log('API key loaded and decrypted');
  }).catch((error) => {
    console.error('Failed to load API key:', error);
  });
  
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
