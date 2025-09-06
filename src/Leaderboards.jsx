import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

function Leaderboards() {
  const [stats, setStats] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('career'); // 'career' or a tournament ID
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'total_runs', direction: 'descending' });

  // Effect to fetch the list of tournaments for the dropdown
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/tournaments/')
      .then(response => {
        setTournaments(response.data);
      })
      .catch(error => console.error('Error fetching tournaments!', error));
  }, []);

  // Effect to fetch stats based on the selected tournament
  useEffect(() => {
    setLoading(true);
    let url = 'http://127.0.0.1:8000/api/career-stats/';
    let initialSortKey = 'total_runs';

    if (selectedTournament !== 'career') {
      url = `http://127.0.0.1:8000/api/stats/?tournament=${selectedTournament}`;
      initialSortKey = 'runs_scored';
    }
    
    axios.get(url)
      .then(response => {
        setStats(response.data);
        setSortConfig({ key: initialSortKey, direction: 'descending' }); // Reset sort when data changes
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the stats!', error);
        setLoading(false);
      });
  }, [selectedTournament]); // This effect re-runs whenever the dropdown selection changes

  const sortedStats = useMemo(() => {
    let sortableStats = [...stats];
    if (sortConfig.key) {
      sortableStats.sort((a, b) => {
        const valA = a[sortConfig.key] || 0;
        const valB = b[sortConfig.key] || 0;
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableStats;
  }, [stats, sortConfig]);

  const requestSort = (key) => {
    let direction = (sortConfig.key === key && sortConfig.direction === 'descending') ? 'ascending' : 'descending';
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    return '';
  };

  // Render the table based on whether career or tournament stats are selected
  const renderTable = () => {
    if (loading) return <div>Loading...</div>;

    if (selectedTournament === 'career') {
      return (
        <table>
          <thead>
            <tr>
              <th><button onClick={() => requestSort('name')}>Player{getSortIndicator('name')}</button></th>
              <th><button onClick={() => requestSort('total_matches')}>Matches{getSortIndicator('total_matches')}</button></th>
              <th><button onClick={() => requestSort('total_runs')}>Runs{getSortIndicator('total_runs')}</button></th>
              <th><button onClick={() => requestSort('career_highest_score')}>HS{getSortIndicator('career_highest_score')}</button></th>
              <th><button onClick={() => requestSort('total_wickets')}>Wickets{getSortIndicator('total_wickets')}</button></th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((player, index) => (
              <tr key={index}>
                <td>{player.name}</td>
                <td>{player.total_matches ?? '-'}</td>
                <td>{player.total_runs ?? '-'}</td>
                <td>{player.career_highest_score ?? '-'}</td>
                <td>{player.total_wickets ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      // Tournament View
      return (
        <table>
          <thead>
            <tr>
              <th><button onClick={() => requestSort('player_name')}>Player{getSortIndicator('player_name')}</button></th>
              <th><button onClick={() => requestSort('matches_played')}>Matches{getSortIndicator('matches_played')}</button></th>
              <th><button onClick={() => requestSort('runs_scored')}>Runs{getSortIndicator('runs_scored')}</button></th>
              <th><button onClick={() => requestSort('highest_score')}>HS{getSortIndicator('highest_score')}</button></th>
              <th><button onClick={() => requestSort('wickets_taken')}>Wickets{getSortIndicator('wickets_taken')}</button></th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((stat, index) => (
              <tr key={index}>
                <td>{stat.player_name}</td>
                <td>{stat.matches_played ?? '-'}</td>
                <td>{stat.runs_scored ?? '-'}</td>
                <td>{stat.highest_score ?? '-'}</td>
                <td>{stat.wickets_taken ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div>
      <h1>Leaderboards</h1>
      <div>
        <label htmlFor="tournament-select">Filter by Tournament: </label>
        <select 
          id="tournament-select" 
          value={selectedTournament} 
          onChange={e => setSelectedTournament(e.target.value)}
        >
          <option value="career">Career Stats</option>
          {tournaments.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      
      {renderTable()}
    </div>
  );
}

export default Leaderboards;