import React from 'react'; // Removed useState and useEffect
import { Routes, Route, Link, Outlet } from 'react-router-dom';
// Axios is no longer needed here
import PlayerDetail from './PlayerDetail';
import Leaderboards from './Leaderboards';
import PlayerList from './PlayerList'; // 👈 IMPORT YOUR NEW COMPONENT
import './App.css';

// This component provides a consistent layout with navigation
// THIS LAYOUT FUNCTION REMAINS UNCHANGED FROM THE PREVIOUS STEP
function Layout() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800 shadow-md">
        <nav className="container mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
            GECC Stats
          </Link>
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
      <main className="container mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  );
}

// 🚨 Notice the old PlayerList() function is completely gone from this file.

// This is the main App component that controls routing
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* The index route now renders your imported PlayerList component */}
        <Route index element={<PlayerList />} /> 
        <Route path="leaderboards" element={<Leaderboards />} />
        <Route path="players/:playerId" element={<PlayerDetail />} />
      </Route>
    </Routes>
  );
}

export default App;