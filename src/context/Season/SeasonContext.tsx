import { createContext, useContext } from 'react';
import type { SeasonDto } from '../../api/f1DashboardAPI.schemas';

interface SeasonContextValue {
  selectedSeason: SeasonDto | null;
  setSelectedSeason: (season: SeasonDto | null) => void;
}

export const SeasonContext = createContext<SeasonContextValue | undefined>(undefined);

export const useSeasonContext = () => {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error('useSeasonContext must be used within a SeasonProvider');
  }
  return context;
}; 