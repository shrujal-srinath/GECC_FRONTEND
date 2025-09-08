import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TopPerformerCard = ({ title, player, stats, icon }) => {
  if (!player) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center flex-1 min-w-[300px]">
        <h3 className="text-xl font-bold text-gray-400 mb-2">{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg flex-1 min-w-[300px]">
      <div className="flex items-center gap-4 mb-4">
        {icon && <span className="text-3xl">{icon}</span>}
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <p className="text-3xl font-extrabold text-green-400">{player.name}</p>
      <div className="mt-4 border-t border-gray-700 pt-4 grid grid-cols-2 gap-y-2 text-sm">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-gray-400 uppercase tracking-wider">{stat.label}</span>
            <span className="font-semibold">{stat.value}</span> {/* Now displays 0 instead of '-' */}
          </div>
        ))}
      </div>
    </div>
  );
};

function TopPerformers() {
  const [topBatsman, setTopBatsman] = useState(null);
  const [topBowler, setTopBowler] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        const [batsmanResponse, bowlerResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/top-performers/top_batsman/'),
          axios.get('http://127.0.0.1:8000/api/top-performers/top_bowler/'),
        ]);
        setTopBatsman(batsmanResponse.data);
        setTopBowler(bowlerResponse.data);
      } catch (error) {
        console.error('Error fetching top performers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPerformers();
  }, []);

  if (loading) {
    return <div className="text-center text-xl text-gray-400">Loading top performers...</div>;
  }

  const batsmanStats = topBatsman ? [
    { label: 'Total Runs', value: topBatsman.total_runs },
    { label: 'Highest Score', value: topBatsman.career_highest_score ?? '-' }, // Keep hyphen for NULL highest score
    { label: 'Fours', value: topBatsman.total_fours },
    { label: 'Sixes', value: topBatsman.total_sixes },
    { label: '50s', value: topBatsman.total_fifties },
    { label: '100s', value: topBatsman.total_hundreds },
  ] : [];

  const bowlerStats = topBowler ? [
    { label: 'Total Wickets', value: topBowler.total_wickets },
    { label: 'Total Maidens', value: topBowler.total_maidens },
    { label: 'Matches', value: topBowler.total_matches },
    { label: 'Playing Role', value: topBowler.playing_role ?? '-' },
    { label: 'Bowling Style', value: topBowler.bowling_style ?? '-' },
  ] : [];

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Top Performers</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        <TopPerformerCard
          title="Top Batsman"
          player={topBatsman}
          stats={batsmanStats}
          icon="🏏"
        />
        <TopPerformerCard
          title="Top Bowler"
          player={topBowler}
          stats={bowlerStats}
          icon="🎯"
        />
      </div>
      <div className="text-center mt-6">
        <Link 
          to="/leaderboards" 
          className="inline-block bg-green-500 text-white font-bold py-2 px-6 rounded-full hover:bg-green-600 transition-colors"
        >
          View Full Leaderboards
        </Link>
      </div>
    </div>
  );
}

export default TopPerformers;