import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// Helper function to format averages/strike rates to 2 decimal places
const formatNum = (num) => {
  const floatNum = parseFloat(num);
  // Return '-' if num is null, 0, or NaN, otherwise format it
  return (floatNum && floatNum !== 0) ? floatNum.toFixed(2) : '-';
};

// A new component for the career summary stat block
const CareerStatBlock = ({ label, value }) => (
  <div className="text-center md:text-left">
    <span className="font-semibold text-gray-400 block uppercase text-sm tracking-wider">{label}</span>
    <span className="text-3xl font-bold text-white">{value ?? '-'}</span>
  </div>
);


function PlayerDetail() {
  const [player, setPlayer] = useState(null);
  const [careerStats, setCareerStats] = useState(null); // 👈 1. ADD NEW STATE FOR CAREER STATS
  const { playerId } = useParams();

  useEffect(() => {
    // This fetches the main player profile and tournament list
    axios.get(`http://127.0.0.1:8000/api/players/${playerId}/`)
      .then(response => {
        setPlayer(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the player details!', error);
      });
  }, [playerId]);

  // 👈 2. ADD NEW EFFECT TO FETCH CAREER STATS
  useEffect(() => {
    // This fetches the career stats for ALL players
    axios.get('http://127.0.0.1:8000/api/career-stats/')
      .then(response => {
        // We need to find OUR player in the list from the API
        const allStats = response.data;
        // Note: we parse playerId from URL params (which is a string) to an integer for a strict match
        const foundStats = allStats.find(stat => stat.id === parseInt(playerId)); 
        setCareerStats(foundStats);
      })
      .catch(error => {
        console.error('There was an error fetching the career stats!', error);
      });
  }, [playerId]); // This also runs when the playerId changes


  // Update the loading guard to wait for BOTH API calls
  if (!player || !careerStats) {
    return <div className="text-center text-xl text-gray-400">Loading player data...</div>;
  }

  return (
    <div className="text-white">
      {/* Back Link (unchanged) */}
      <Link 
        to="/" 
        className="inline-block mb-6 text-green-400 hover:text-green-300 transition-colors"
      >
        &larr; Back to Player List
      </Link>
      
      <h1 className="text-5xl font-bold mb-4">{player.name}</h1>

      {/* Player Profile Box (unchanged) */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <div className="text-lg">
            <span className="font-semibold text-gray-400 block uppercase text-sm tracking-wider">Role</span>
            <span className="text-xl">{player.playing_role || 'N/A'}</span>
          </div>
          <div className="text-lg">
            <span className="font-semibold text-gray-400 block uppercase text-sm tracking-wider">Batting Hand</span>
            <span className="text-xl">{player.batting_style || 'N/A'}</span>
          </div>
          <div className="text-lg">
            <span className="font-semibold text-gray-400 block uppercase text-sm tracking-wider">Bowling Style</span>
            <span className="text-xl">{player.bowling_style || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* 👈 3. ADD THE NEW CAREER SUMMARY JSX */}
      <h2 className="text-3xl font-semibold mb-4">Career Summary</h2>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
          <CareerStatBlock label="Matches" value={careerStats.total_matches} />
          <CareerStatBlock label="Total Runs" value={careerStats.total_runs} />
          <CareerStatBlock label="Highest Score" value={careerStats.career_highest_score} />
          <CareerStatBlock label="Total Wickets" value={careerStats.total_wickets} />
          <CareerStatBlock label="Total Fours" value={careerStats.total_fours} />
          <CareerStatBlock label="Total Sixes" value={careerStats.total_sixes} />
          <CareerStatBlock label="Total Maidens" value={careerStats.total_maidens} />
          <CareerStatBlock label="Total Not Outs" value={careerStats.total_not_outs} />
        </div>
      </div>


      {/* --- Batting Stats Table (Unchanged) --- */}
      <h2 className="text-3xl font-semibold mb-4">Batting by Tournament</h2>
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

      {/* --- Bowling Stats Table (Unchanged) --- */}
      <h2 className="text-3xl font-semibold mb-4">Bowling by Tournament</h2>
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