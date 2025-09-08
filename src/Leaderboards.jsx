import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

function Leaderboards() {
  const [stats, setStats] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('career');
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
        setSortConfig({ key: initialSortKey, direction: 'descending' });
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the stats!', error);
        setLoading(false);
      });
  }, [selectedTournament]);

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
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };
  
  const getSortClass = (key) => {
    return sortConfig.key === key ? 'text-green-400 font-bold' : '';
  }

  // Helper function to display '-' for null or zero values in certain fields
  const displayValue = (value) => {
    return (value === null || value === 0) ? '-' : value;
  };

  const renderTable = () => {
    if (loading) return <div className="text-center text-xl text-gray-400">Loading...</div>;
    
    if (selectedTournament === 'career') {
      return (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full min-w-max text-left text-white">
            <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
              <tr>
                <th className="p-3 tracking-wider"><button className={`focus:outline-none ${getSortClass('name')}`} onClick={() => requestSort('name')}>Player{getSortIndicator('name')}</button></th>
                <th className="p-3 tracking-wider"><button className={`focus:outline-none ${getSortClass('total_matches')}`} onClick={() => requestSort('total_matches')}>Matches{getSortIndicator('total_matches')}</button></th>
                <th className="p-3 tracking-wider"><button className={`focus:outline-none ${getSortClass('total_runs')}`} onClick={() => requestSort('total_runs')}>Runs{getSortIndicator('total_runs')}</button></th>
                <th className="p-3 tracking-wider"><button className={`focus:outline-none ${getSortClass('career_highest_score')}`} onClick={() => requestSort('career_highest_score')}>HS{getSortIndicator('career_highest_score')}</button></th>
                <th className="p-3 tracking-wider"><button className={`focus:outline-none ${getSortClass('total_wickets')}`} onClick={() => requestSort('total_wickets')}>Wickets{getSortIndicator('total_wickets')}</button></th>
                <th className="p-3 tracking-wider"><button className={`focus:outline-none ${getSortClass('total_maidens')}`} onClick={() => requestSort('total_maidens')}>Mdns{getSortIndicator('total_maidens')}</button></th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sortedStats.map((player, index) => (
                <tr key={index} className="hover:bg-gray-700 transition-colors">
                  <td className="p-3">{player.name}</td>
                  <td className="p-3">{player.total_matches ?? '-'}</td>
                  <td className="p-3">{player.total_runs ?? '-'}</td>
                  <td className="p-3">{displayValue(player.career_highest_score)}</td>
                  <td className="p-3">{player.total_wickets ?? '-'}</td>
                  <td className="p-3">{player.total_maidens ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Tournament View
      return (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full min-w-max text-left text-white">
            <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
              <tr>
                <th className="p-3 tracking-wider"><button className={`focus:outline-none ${getSortClass('player_name')}`} onClick={() => requestSort('player_name')}>Player{getSortIndicator('player_name')}</button></th>
                <th className="p-3 tracking-wider"><button className={`focus:outline-none ${getSortClass('matches_played')}`} onClick={() => requestSort('matches_played')}>Matches{getSortIndicator('matches_played')}</button></th>
                <th className="p-3 tracking-wider"><button className={`focus:outline-none ${getSortClass('runs_scored')}`} onClick={() => requestSort('runs_scored')}>Runs{getSortIndicator('runs_scored')}</button></th>
                <th className="p-3 tracking-wider"><button className={`focus:outline-none ${getSortClass('highest_score')}`} onClick={() => requestSort('highest_score')}>HS{getSortIndicator('highest_score')}</button></th>
                <th className="p-3 tracking-wider"><button className={`focus:outline-none ${getSortClass('wickets_taken')}`} onClick={() => requestSort('wickets_taken')}>Wickets{getSortIndicator('wickets_taken')}</button></th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sortedStats.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-700 transition-colors">
                  <td className="p-3">{stat.player_name}</td>
                  <td className="p-3">{stat.matches_played ?? '-'}</td>
                  <td className="p-3">{stat.runs_scored ?? '-'}</td>
                  <td className="p-3">{displayValue(stat.highest_score)}</td>
                  <td className="p-3">{stat.wickets_taken ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold mb-4">Leaderboards</h1>
      <div className="mb-6 flex items-center gap-4">
        <label htmlFor="tournament-select" className="text-lg">Filter by Tournament: </label>
        <select 
          id="tournament-select" 
          value={selectedTournament} 
          onChange={e => setSelectedTournament(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
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