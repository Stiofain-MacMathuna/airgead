import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App.jsx';
import './index.css'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  const fallbackUrl = "http://localhost:8080"; 
  axios.defaults.baseURL = fallbackUrl;
  console.error(`VITE_API_BASE_URL is undefined. Falling back to: ${fallbackUrl}`);
} else {
  axios.defaults.baseURL = API_BASE_URL;
  console.log(`Axios base URL set to: ${API_BASE_URL}`); 
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
);