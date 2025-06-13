import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/producerlogin';
import Dashboard from './components/dashboard';
import Header from './components/Header';
import Footer from './components/footer';
import EditMovie from './components/editmovie';
import HomeHelp from './components/homehelp';
import Contact from './components/contact';
import ProducerHelp from './components/producerhelp';

import { useEffect } from 'react';

function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [username]);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Login setUsername={setUsername} />} />
        <Route path="/dashboard" element={<Dashboard username={username} />} />
        <Route path="/edit/:mov_id" element={<EditMovie />} />
        <Route path="/help" element={<HomeHelp />} />
        <Route path="/prodhelp" element={username ? <ProducerHelp username={username} /> : <Login setUsername={setUsername} />}/>
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;