// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from './app/layout';

async function startApp() {
  if (process.env.NODE_ENV === 'development') {
    try {
      const { worker } = await import('./mocks/browser');
      await worker.start();
      console.log('MSW worker started successfully.');
    } catch (error) {
      console.error('Error starting MSW worker:', error);
    }
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </React.StrictMode>
  );
}

startApp();
