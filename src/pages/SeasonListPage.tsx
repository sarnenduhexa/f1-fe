import React from 'react';
import { useSeasonsControllerFindAll } from '../api/seasons/seasons';
import type { SeasonDto } from '../api/f1DashboardAPI.schemas';
import { useNavigate } from 'react-router-dom';
import { useSeasonContext } from '../context/Season/SeasonContext';
import SeasonCard from '../components/SeasonCard';
import Spinner from '../components/Spinner';
import { SiF1 } from "react-icons/si";
import { GiF1Car } from "react-icons/gi";
import { ThemeToggle } from '../components/ThemeToggle';

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
    <div className="mx-auto w-full px-4 py-4 bg-gray-100 dark:bg-gray-900 text-white min-h-screen">
      <header className="mb-8 bg-f1-red p-6 shadow-lg relative overflow-hidden">
        <div className='absolute top-2 right-2 z-10'>
          <ThemeToggle />
        </div>

        <SiF1 className="absolute top-4 left-4 text-yellow-400 text-opacity-20 text-6xl text-shadow-lg/50" aria-hidden="true" />
        <GiF1Car className="absolute bottom-4 right-10 text-white text-opacity-20 
        text-9xl drop-shadow-xl/50 transform align-middle md:block hidden top-2 motion-safe:animate-pulse animate-duration-5000 animate-ease-linear" aria-hidden="true" />
        
        <h1 className="text-3xl md:text-5xl pl-16 text-white text-shadow-lg/30 mb-2 relative md:tracking-wider" data-testid="overview-header">
          Dashboard
        </h1>
        <p className="text-xl text-white text-opacity-90 text-shadow-md relative z-10">Explore Formula 1 Seasons & Champions</p>
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
};

export default SeasonListPage; 