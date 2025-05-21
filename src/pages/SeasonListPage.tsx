import React from 'react';
import { useSeasonsControllerFindAll } from '../api/seasons/seasons';
import ChampionCard from '../components/ChampionCard';
import type { SeasonDto } from '../api/f1DashboardAPI.schemas';

const SeasonListPage: React.FC = () => {
  const { data, isLoading, isError, error } = useSeasonsControllerFindAll();

  if (isLoading) {
    return <div className="text-center py-8" data-testid="loading">Loading seasons...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600" data-testid="error">
        Error loading seasons: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const seasons = data || [];

  if (seasons.length === 0) {
    return <div className="text-center py-8" data-testid="empty">No seasons found.</div>;
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">F1 World Champions</h1>
      <ul className="space-y-2" data-testid="season-list">
        {seasons.map((season: SeasonDto) => (
          <ChampionCard key={season.year} season={season} />
        ))}
      </ul>
    </section>
  );
};

export default SeasonListPage; 