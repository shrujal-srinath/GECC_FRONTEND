import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PlayerDetail() {
  const [player, setPlayer] = useState(null);
  const { playerId } = useParams();

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
      <Link to="/">&larr; Back to Player List</Link>
      <h1>{player.name}</h1>
      <div className="player-profile">
        <span><strong>Role:</strong> {player.playing_role || 'N/A'}</span>
        <span><strong>Batting Hand:</strong> {player.batting_style || 'N/A'}</span>
        <span><strong>Bowling Style:</strong> {player.bowling_style || 'N/A'}</span>
      </div>

      <h2>Batting & Fielding Stats</h2>
      <table>
        <thead>
          <tr>
            <th>Tournament</th>
            <th>Mat</th>
            <th>Runs</th>
            <th>HS</th>
            <th>BF</th>
            <th>Avg</th>
            <th>SR</th>
            <th>100s</th>
            <th>50s</th>
            <th>4s</th>
            <th>6s</th>
          </tr>
        </thead>
        <tbody>
          {player.stats.map((stat, index) => (
            <tr key={index}>
              <td>{stat.tournament_name}</td>
              <td>{stat.batting.matches_played ?? '-'}</td>
              <td>{stat.batting.runs_scored ?? '-'}</td>
              <td>{stat.batting.highest_score ?? '-'}</td>
              <td>{stat.batting.balls_faced ?? '-'}</td>
              <td>{stat.batting.batting_average ?? '-'}</td>
              <td>{stat.batting.batting_strike_rate ?? '-'}</td>
              <td>{stat.batting.hundreds ?? '-'}</td>
              <td>{stat.batting.fifties ?? '-'}</td>
              <td>{stat.batting.fours ?? '-'}</td>
              <td>{stat.batting.sixes ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Bowling Stats</h2>
      <table>
        <thead>
          <tr>
            <th>Tournament</th>
            <th>Overs</th>
            <th>Mdns</th>
            <th>Runs</th>
            <th>Wkts</th>
            <th>Avg</th>
            <th>Econ</th>
            <th>SR</th>
          </tr>
        </thead>
        <tbody>
          {player.stats.map((stat, index) => (
            <tr key={index}>
              <td>{stat.tournament_name}</td>
              <td>{stat.bowling.overs_bowled ?? '-'}</td>
              <td>{stat.bowling.maidens ?? '-'}</td>
              <td>{stat.bowling.runs_conceded ?? '-'}</td>
              <td>{stat.bowling.wickets_taken ?? '-'}</td>
              <td>{stat.bowling.bowling_average ?? '-'}</td>
              <td>{stat.bowling.economy_rate ?? '-'}</td>
              <td>{stat.bowling.bowling_strike_rate ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerDetail;