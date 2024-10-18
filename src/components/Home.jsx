import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI Chat App</h1>
        <p className="text-xl mb-8">Start chatting with our AI assistant today!</p>
        <Link
          to="/chat"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Start Chatting
        </Link>
      </div>
    </div>
  );
}

export default Home;
