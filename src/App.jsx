import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import PlayerDetail from './PlayerDetail';
import Leaderboards from './Leaderboards'; // 👈 Import the new component
import './App.css';

// This component provides a consistent layout with navigation
function Layout() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Player List</Link> | <Link to="/leaderboards">Leaderboards</Link>
        </nav>
      </header>
      <hr />
      <main>
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
}

// This is the Player List Component
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
      <h1>Godrej Eternity Cricket Stats</h1>
      <h2>Player List</h2>
      <ul>
        {players.map(player => (
          <li key={player.id}>
            <Link to={`/players/${player.id}`}>{player.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// This is the main App component that controls routing
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