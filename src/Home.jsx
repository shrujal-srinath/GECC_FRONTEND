import React from 'react';
import TopPerformers from './TopPerformers';
import RecentMatches from './RecentMatches'; // 👈 IMPORT THE NEW COMPONENT

function Home() {
  return (
    <div className="text-white">
      <h1 className="text-6xl font-bold mb-4 text-center text-green-400">Welcome to the GECC!</h1>
      <p className="text-xl text-center">Your one-stop destination for all Godrej Eternity Cricket stats and news.</p>
      
      <TopPerformers />
      
      {/* 👈 RENDER THE NEW RECENT MATCHES COMPONENT HERE */}
      <RecentMatches />
    </div>
  );
}

export default Home;