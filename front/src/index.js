import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './header';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <h1 className="text-3xl font-bold underline italic">
      Hello world!
    </h1>
    <Header />
  </React.StrictMode>
);