import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../src/components/icons.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
