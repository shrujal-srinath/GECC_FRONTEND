import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PlayerDetail() {
  const [player, setPlayer] = useState(null);
  const { playerId } = useParams(); // Gets the ID from the URL

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/players/${playerId}/`)
      .then(response => {
        setPlayer(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the player details!', error);
      });
  }, [playerId]);

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to="/"> &larr; Back to Player List</Link>
      <h1>{player.name}</h1>
      <h2>Tournament Stats</h2>
      <table>
        <thead>
          <tr>
            <th>Tournament</th>
            <th>Runs Scored</th>
            <th>Wickets Taken</th>
            <th>Batting Avg</th>
            <th>Bowling Avg</th>
          </tr>
        </thead>
        <tbody>
          {player.stats.map((stat, index) => (
            <tr key={index}>
              <td>{stat.tournament_name}</td>
              <td>{stat.runs_scored ?? 'N/A'}</td>
              <td>{stat.wickets_taken ?? 'N/A'}</td>
              <td>{stat.batting_average ?? 'N/A'}</td>
              <td>{stat.bowling_average ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerDetail;