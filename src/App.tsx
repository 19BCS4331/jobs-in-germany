import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Companies from './pages/Companies';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import { AuthProvider } from './lib/AuthContext';

function App() {
  return (
    <AuthProvider>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;