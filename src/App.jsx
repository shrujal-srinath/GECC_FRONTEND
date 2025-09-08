import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import Home from './Home'; // 👈 IMPORT THE NEW HOME COMPONENT
import PlayerDetail from './PlayerDetail';
import Leaderboards from './Leaderboards';
import PlayerList from './PlayerList';
import './App.css';

// This component provides a consistent layout with navigation
function Layout() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800 shadow-md">
        <nav className="container mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
            GECC
          </Link>
          <div className="flex gap-6">
            <Link 
              to="/players" 
              className="text-lg text-gray-300 hover:text-green-400 transition-colors"
            >
              Player Profiles
            </Link>
            <Link 
              to="/leaderboards" 
              className="text-lg text-gray-300 hover:text-green-400 transition-colors"
            >
              Stats
            </Link>
            <Link 
              to="/tournaments" 
              className="text-lg text-gray-300 hover:text-green-400 transition-colors"
            >
              Tournaments
            </Link>
            <Link 
              to="/gallery" 
              className="text-lg text-gray-300 hover:text-green-400 transition-colors"
            >
              Gallery
            </Link>
            <Link 
              to="/auctions" 
              className="text-lg text-gray-300 hover:text-green-400 transition-colors"
            >
              Auctions
            </Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* The index route is now the new Home component */}
        <Route index element={<Home />} /> 
        {/* All other routes are now nested under the main layout */}
        <Route path="players" element={<PlayerList />} /> 
        <Route path="leaderboards" element={<Leaderboards />} />
        <Route path="players/:playerId" element={<PlayerDetail />} />

        {/* Placeholder routes for the new pages */}
        <Route path="tournaments" element={<div>Tournaments Page</div>} />
        <Route path="gallery" element={<div>Gallery Page</div>} />
        <Route path="auctions" element={<div>Auctions Page</div>} />
      </Route>
    </Routes>
  );
}

export default App;