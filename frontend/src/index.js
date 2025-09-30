import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import Profile from './pages/Profile';
import Departments from './pages/Departments';
import Calllogs from './pages/Calllogs'
import App from './App';
import Voicetest from './pages/Voicetest';
import Charts from './pages/Charts'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/ai-call-assistant">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/call" element={<Calllogs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/test" element={<Voicetest/>} />
        <Route path='/charts' element = {<Charts/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
