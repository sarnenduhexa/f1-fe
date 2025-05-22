import React from 'react';
import type { SeasonDto } from '../api/f1DashboardAPI.schemas';

interface ChampionCardProps {
  season: SeasonDto;
  onSelect: () => void;
}

const ChampionCard: React.FC<ChampionCardProps> = ({ season, onSelect }) => {
  const { year, winner } = season;

  return (
    <li
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4 flex flex-col sm:flex-row items-center justify-between cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
      data-testid={`champion-card-${year}`}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${year} season`}
      onClick={onSelect}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onSelect();
      }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <span className="text-2xl font-bold text-blue-700 dark:text-yellow-400" data-testid="champion-year">{year}</span>
        {winner ? (
          <>
            <span className="text-lg font-semibold ml-2" data-testid="champion-name">{winner.givenName} {winner.familyName}</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-300" data-testid="champion-nationality">{winner.nationality}</span>
          </>
        ) : (
          <span className="ml-2 text-sm text-gray-400">No winner data</span>
        )}
      </div>
      <span className="mt-2 sm:mt-0 text-xs text-gray-400">Click or press Enter for details</span>
    </li>
  );
};

export default ChampionCard; 