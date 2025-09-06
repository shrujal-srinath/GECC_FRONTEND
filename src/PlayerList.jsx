import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/players/')
      .then(response => {
        setPlayers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the players!', error);
      });
  }, []);

  // New logic to filter players based on search term
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-4xl font-bold text-white">All Players</h1>
        
        {/* The new search input bar */}
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      
      {/* New Styled Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map(player => (
          <Link 
            key={player.id}
            to={`/players/${player.id}`} 
            className="block bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-green-400">
              {player.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PlayerList;