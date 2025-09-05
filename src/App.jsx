import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import PlayerDetail from './PlayerDetail'; // Import the new component
import './App.css';

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
      <Route path="/" element={<PlayerList />} />
      <Route path="/players/:playerId" element={<PlayerDetail />} />
    </Routes>
  );
}

export default App;