import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useFirebase } from './context/FirebaseContext';
import { useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Chat from './components/Chat';

function App() {
  const { user } = useFirebase();
  const { darkMode } = useTheme();

  return (
    <Router>
      <div className={`min-h-[100vh] ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Header />
        <main className="container mx-auto mt-4 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/chat" /> : <Signup />} />
            <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
