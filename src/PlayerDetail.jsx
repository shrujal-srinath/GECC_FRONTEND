import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const formatNum = (num) => {
  const floatNum = parseFloat(num);
  if (num === null || num === undefined) {
    return '-';
  }
  if (floatNum === 0) {
    return '-';
  }
  return floatNum.toFixed(2);
};

const CareerStatBlock = ({ label, value }) => (
  <div className="text-center md:text-left">
    <span className="font-semibold text-gray-400 block uppercase text-sm tracking-wider">{label}</span>
    <span className="text-3xl font-bold text-white">{value ?? '-'}</span>
  </div>
);

function PlayerDetail() {
  const [player, setPlayer] = useState(null);
  const [careerStats, setCareerStats] = useState(null);
  const { playerId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/players/${playerId}/career_summary/`)
      .then(response => {
        setPlayer(response.data);
        setCareerStats(response.data.career_summary);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the player details!', error);
        setLoading(false);
      });
  }, [playerId]);

  if (loading) {
    return <div className="text-center text-xl text-gray-400">Loading player data...</div>;
  }

  if (!player) {
    return <div className="text-center text-xl text-red-400">Player not found.</div>;
  }

  const playerPhotoUrl = player.photo ? `http://127.0.0.1:8000${player.photo}` : 'https://via.placeholder.com/150';

  return (
    <div className="text-white">
      <Link 
        to="/players" 
        className="inline-block mb-6 text-green-400 hover:text-green-300 transition-colors"
      >
        &larr; Back to Player List
      </Link>
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <img 
            src={playerPhotoUrl}
            alt={player.name} 
            className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-green-400 object-cover" 
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">{player.name}</h1>
          <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center md:justify-start text-lg text-gray-300">
            <span>
              <span className="font-semibold block uppercase text-sm tracking-wider">Role:</span>
              <span className="text-xl text-white">{player.playing_role || 'N/A'}</span>
            </span>
            <span>
              <span className="font-semibold block uppercase text-sm tracking-wider">Batting:</span>
              <span className="text-xl text-white">{player.batting_style || 'N/A'}</span>
            </span>
            <span>
              <span className="font-semibold block uppercase text-sm tracking-wider">Bowling:</span>
              <span className="text-xl text-white">{player.bowling_style || 'N/A'}</span>
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-semibold mb-4 text-center md:text-left">Career Summary</h2>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
          <CareerStatBlock label="Matches" value={careerStats.total_matches} />
          <CareerStatBlock label="Total Runs" value={careerStats.total_runs} />
          <CareerStatBlock label="Highest Score" value={careerStats.career_highest_score ?? '-'} />
          <CareerStatBlock label="Total Wickets" value={careerStats.total_wickets} />
          <CareerStatBlock label="Total Fours" value={careerStats.total_fours} />
          <CareerStatBlock label="Total Sixes" value={careerStats.total_sixes} />
          <CareerStatBlock label="Total Maidens" value={careerStats.total_maidens} />
          <CareerStatBlock label="Total Not Outs" value={careerStats.total_not_outs} />
        </div>
      </div>

      <h2 className="text-3xl font-semibold mb-4 text-center md:text-left">Batting by Tournament</h2>
      <div className="overflow-x-auto rounded-lg shadow-md mb-8">
        <table className="w-full min-w-max text-left">
          <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
            <tr>
              <th className="p-3 tracking-wider">Tournament</th>
              <th className="p-3 tracking-wider">Mat</th>
              <th className="p-3 tracking-wider">Runs</th>
              <th className="p-3 tracking-wider">HS</th>
              <th className="p-3 tracking-wider">BF</th>
              <th className="p-3 tracking-wider">Avg</th>
              <th className="p-3 tracking-wider">SR</th>
              <th className="p-3 tracking-wider">100s</th>
              <th className="p-3 tracking-wider">50s</th>
              <th className="p-3 tracking-wider">4s</th>
              <th className="p-3 tracking-wider">6s</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {player.stats.map((stat, index) => (
              <tr key={index} className="hover:bg-gray-700 transition-colors">
                <td className="p-3 font-semibold text-green-400">{stat.tournament_name}</td>
                <td className="p-3">{stat.batting.matches_played ?? '-'}</td>
                <td className="p-3 font-bold">{stat.batting.runs_scored ?? '-'}</td>
                <td className="p-3">{stat.batting.highest_score ?? '-'}</td>
                <td className="p-3">{stat.batting.balls_faced ?? '-'}</td>
                <td className="p-3">{formatNum(stat.batting.batting_average)}</td>
                <td className="p-3">{formatNum(stat.batting.batting_strike_rate)}</td>
                <td className="p-3">{stat.batting.hundreds ?? '-'}</td>
                <td className="p-3">{stat.batting.fifties ?? '-'}</td>
                <td className="p-3">{stat.batting.fours ?? '-'}</td>
                <td className="p-3">{stat.batting.sixes ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-3xl font-semibold mb-4 text-center md:text-left">Bowling by Tournament</h2>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full min-w-max text-left">
          <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
            <tr>
              <th className="p-3 tracking-wider">Tournament</th>
              <th className="p-3 tracking-wider">Overs</th>
              <th className="p-3 tracking-wider">Mdns</th>
              <th className="p-3 tracking-wider">Runs</th>
              <th className="p-3 tracking-wider">Wkts</th>
              <th className="p-3 tracking-wider">Avg</th>
              <th className="p-3 tracking-wider">Econ</th>
              <th className="p-3 tracking-wider">SR</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {player.stats.map((stat, index) => (
              <tr key={index} className="hover:bg-gray-700 transition-colors">
                <td className="p-3 font-semibold text-green-400">{stat.tournament_name}</td>
                <td className="p-3">{stat.bowling.overs_bowled ?? '-'}</td>
                <td className="p-3">{stat.bowling.maidens ?? '-'}</td>
                <td className="p-3">{stat.bowling.runs_conceded ?? '-'}</td>
                <td className="p-3 font-bold">{stat.bowling.wickets_taken ?? '-'}</td>
                <td className="p-3">{formatNum(stat.bowling.bowling_average)}</td>
                <td className="p-3">{formatNum(stat.bowling.economy_rate)}</td>
                <td className="p-3">{formatNum(stat.bowling.bowling_strike_rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlayerDetail;