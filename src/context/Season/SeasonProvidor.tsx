import { useState, type ReactNode } from "react";
import { SeasonContext } from "./SeasonContext";
import type { SeasonDto } from "../../api/f1DashboardAPI.schemas";

export const SeasonProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSeason, setSelectedSeason] = useState<SeasonDto | null>(null);
  return (
    <SeasonContext.Provider value={{ selectedSeason, setSelectedSeason }}>
      {children}
    </SeasonContext.Provider>
  );
};
