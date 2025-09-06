import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import PlayerDetail from './PlayerDetail';
import Leaderboards from './Leaderboards';
import './App.css'; // Your original App.css import

// This component provides a consistent layout with navigation
function Layout() {
  return (
    // Set a site-wide dark theme and font
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800 shadow-md">
        <nav className="container mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          {/* Site Title / Home Link */}
          <Link to="/" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
            GECC Stats
          </Link>
          
          {/* Navigation Links */}
          <div className="flex gap-6">
            <Link 
              to="/" 
              className="text-lg text-gray-300 hover:text-green-400 transition-colors"
            >
              Players
            </Link>
            <Link 
              to="/leaderboards" 
              className="text-lg text-gray-300 hover:text-green-400 transition-colors"
            >
              Leaderboards
            </Link>
          </div>
        </nav>
      </header>
      
      {/* Main content area where child routes will render */}
      <main className="container mx-auto max-w-7xl p-6">
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
}

// This is the Player List Component (functionality unchanged, but it will now live inside the styled Layout)
function PlayerList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/players/')
      .then(response => {
        setPlayers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the players!', error);
      });
  }, []);

  return (
    <div>
      {/* This title will now appear BELOW the nav bar */}
      <h1 className="text-4xl font-bold mb-6 text-white">All Players</h1>
      
      {/* We will style this list properly in the next step */}
      <ul className="list-disc pl-5"> 
        {players.map(player => (
          <li key={player.id} className="mb-2">
            <Link 
              to={`/players/${player.id}`} 
              className="text-lg text-green-400 hover:text-green-300 hover:underline"
            >
              {player.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// This is the main App component that controls routing (functionality unchanged)
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PlayerList />} />
        <Route path="leaderboards" element={<Leaderboards />} />
        <Route path="players/:playerId" element={<PlayerDetail />} />
      </Route>
    </Routes>
  );
}

export default App;