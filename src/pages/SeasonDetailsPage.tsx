import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSeasonContext } from '../context/Season/SeasonContext';
import { useSeasonsControllerFindOne } from '../api/seasons/seasons';
import { useRacesControllerFindBySeason } from '../api/races/races';
import type { SeasonDto, RaceDto } from '../api/f1DashboardAPI.schemas';

const SeasonDetailsPage: React.FC = () => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const { selectedSeason } = useSeasonContext();
  const [season, setSeason] = useState<SeasonDto | null>(selectedSeason);

  // Fetch season if not in context (deep link/refresh)
  const {
    data: fetchedSeason,
    isLoading: isSeasonLoading,
    isError: isSeasonError,
    error: seasonError,
  } = useSeasonsControllerFindOne(Number(seasonId!), {
    query: { enabled: !season },
  });

  useEffect(() => {
    if (!season && fetchedSeason) {
      setSeason(fetchedSeason);
    }
  }, [season, fetchedSeason]);

  // Fetch races for the season
  const {
    data: races,
    isLoading: isRacesLoading,
    isError: isRacesError,
    error: racesError,
  } = useRacesControllerFindBySeason(Number(seasonId!));

  if (isSeasonLoading || isRacesLoading) {
    return <div className="text-center py-8">Loading season details...</div>;
  }
  if (isSeasonError) {
    return <div className="text-center py-8 text-red-600">Error loading season: {String(seasonError)}</div>;
  }
  if (isRacesError) {
    return <div className="text-center py-8 text-red-600">Error loading races: {String(racesError)}</div>;
  }
  if (!season) {
    return <div className="text-center py-8">Season not found.</div>;
  }

  const championId = season.winner?.driverId || season.winnerDriverId;

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-900 text-white rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{season.year} Champion</h2>
          {season.winner ? (
            <>
              <div className="text-xl font-semibold">{season.winner.givenName} {season.winner.familyName}</div>
              <div className="text-sm text-gray-300">{season.winner.nationality}</div>
            </>
          ) : (
            <div className="text-gray-400">No winner data</div>
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4">Race Results</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Grand Prix</th>
              <th className="px-4 py-2">Winner</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(races) && races.length > 0 ? (
              races.map((race: RaceDto) => (
                <tr
                  key={race.id}
                  className={
                    race.winnerDriverId === championId
                      ? 'bg-yellow-100 dark:bg-yellow-900 font-bold'
                      : ''
                  }
                  data-testid={race.winnerDriverId === championId ? 'champion-win' : undefined}
                >
                  <td className="px-4 py-2">{race.date}</td>
                  <td className="px-4 py-2">{race.raceName}</td>
                  <td className="px-4 py-2">
                    {race.winnerDriver
                      ? `${race.winnerDriver.givenName} ${race.winnerDriver.familyName}`
                      : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">No races found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SeasonDetailsPage; 