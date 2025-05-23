import React from 'react';
import { useSeasonsControllerFindAll } from '../api/seasons/seasons';
import ChampionCard from '../components/ChampionCard';
import type { SeasonDto } from '../api/f1DashboardAPI.schemas';
import { useNavigate } from 'react-router-dom';
import { useSeasonContext } from '../context/Season/SeasonContext';
import SeasonCard from '../components/SeasonCard';
import Spinner from '../components/Spinner';
import { FaFlagCheckered, FaTrophy } from 'react-icons/fa';
import { SiF1 } from "react-icons/si";

const SeasonListPage: React.FC = () => {
  const { data, isLoading, isError, error } = useSeasonsControllerFindAll();
  const navigate = useNavigate();
  const { setSelectedSeason } = useSeasonContext();

  if (isLoading) {
    return <Spinner data-testid="loading-spinner" />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100" data-testid="error-message-container">
        <p className="text-red-600 text-lg p-4 bg-white rounded-lg shadow-md">Error loading seasons: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  const seasons = data || [];

  const handleSelectSeason = (season: SeasonDto) => {
    setSelectedSeason(season);
    void navigate(`/season/${season.year}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-white min-h-screen">
      <header className="text-center mb-12 bg-red-800 p-6 rounded-xl shadow-lg relative overflow-hidden">
        <FaFlagCheckered className="absolute top-4 left-4 text-white text-opacity-20 text-6xl transform -rotate-12" aria-hidden="true" />
        <FaTrophy className="absolute bottom-4 right-4 text-white text-opacity-20 text-6xl transform rotate-12" aria-hidden="true" />

        <h1 className="text-5xl font-extrabold text-white mb-2 relative z-10" data-testid="overview-header" style={{ fontFamily: 'Formula1, sans-serif' }}>
          <span className="text-yellow-400">F1</span> DASHBOARD
        </h1>
        <p className="text-xl text-white text-opacity-90 relative z-10">Explore Formula 1 Seasons & Champions</p>
      </header>

      {seasons.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No season data available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {seasons.map((season) => (
            <SeasonCard
              key={season.year}
              season={season}
              onClick={handleSelectSeason}
            />
          ))}
        </div>
      )}
    </div>
  );
  /* return (
    <section className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">F1 World Champions</h1>
      <ul className="space-y-2" data-testid="season-list">
        {seasons.map((season: SeasonDto) => (
          <ChampionCard key={season.year} season={season} onSelect={() => handleSelectSeason(season)} />
        ))}
      </ul>
    </section>
  ); */
};

export default SeasonListPage; 