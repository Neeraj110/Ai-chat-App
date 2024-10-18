import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { user, logout } = useFirebase();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      console.log('User signed out successfully');
      navigate('/login'); // Redirect to login page after successful logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-4`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">AI Chat App</Link>
        <nav>
          {user ? (
            <>
              <button
                onClick={toggleDarkMode}
                className={`${darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-800 hover:bg-gray-300'} text-white font-bold py-2 px-4 rounded mr-2`}
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
