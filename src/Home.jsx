import React from 'react';
import TopPerformers from './TopPerformers'; // 👈 IMPORT THE NEW COMPONENT

function Home() {
  return (
    <div className="text-center text-white">
      <h1 className="text-6xl font-bold mb-4 text-green-400">Welcome to the GECC!</h1>
      <p className="text-xl">Your one-stop destination for all Godrej Eternity Cricket stats and news.</p>
      
      {/* 👈 RENDER THE NEW TOP PERFORMERS COMPONENT */}
      <TopPerformers />

    </div>
  );
}

export default Home;