import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecentMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent matches from the new API endpoint
    axios.get('http://127.0.0.1:8000/api/matches/')
      .then(response => {
        setMatches(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recent matches:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-xl text-gray-400">Loading recent match results...</div>;
  }

  if (matches.length === 0) {
    return <div className="text-center text-xl text-gray-400">No recent matches found.</div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Recent Match Results</h2>
      <div className="flex overflow-x-auto gap-6 p-4 rounded-lg bg-gray-800 scroll-smooth">
        {matches.map(match => (
          <div key={match.id} className="min-w-[300px] bg-gray-900 rounded-lg shadow-xl p-6 text-center text-white">
            <h3 className="text-lg font-bold">{match.team1_name} vs {match.team2_name}</h3>
            <p className="text-sm text-gray-400 mt-1">{new Date(match.date).toLocaleDateString()}</p>
            <div className="mt-4 text-center">
              <span className="block text-2xl font-bold">{match.winner_name} wins!</span>
              <p className="text-sm text-gray-300">Player of the Match: {match.player_of_the_match || 'N/A'}</p>
            </div>
            <div className="mt-4 border-t border-gray-700 pt-4">
              <p className="text-sm text-gray-400">Scores: </p>
              <p className="text-xl font-semibold">{match.team1_name}: {match.team1_score} | {match.team2_name}: {match.team2_score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentMatches;