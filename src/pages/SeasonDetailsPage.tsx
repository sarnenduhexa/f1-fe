import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSeasonContext } from '../context/Season/SeasonContext';
import { useSeasonsControllerFindOne } from '../api/seasons/seasons';
import { useRacesControllerFindBySeason } from '../api/races/races';
import type { SeasonDto } from '../api/f1DashboardAPI.schemas';
import Spinner from '../components/Spinner';
import RaceRow from '../components/RaceRow';
import RaceCard from '../components/RaceCard';
import { FaFlagCheckered } from 'react-icons/fa';

const SeasonDetailsPage: React.FC = () => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const { selectedSeason } = useSeasonContext();
  const [season, setSeason] = useState<SeasonDto | null>(selectedSeason);
  const navigate = useNavigate();

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
    return <Spinner data-testid="loading-spinner" />;
  }
  if (isSeasonError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900" data-testid="season-error-message-container">
          <p className="text-red-500 text-lg p-4 bg-gray-800 rounded-lg shadow-md">Error loading season: {String(seasonError)}</p>
      </div>
    );
  }
  if (isRacesError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900" data-testid="race-error-message-container">
        <p className="text-red-500 text-lg p-4 bg-gray-800 rounded-lg shadow-md">Error loading races: {String(racesError)}</p>
      </div>
    );
  }
  if (!season) {
    return <div className="text-center py-8" data-testid="season-not-found-message">Season not found.</div>;
  }

  const championId = season.winner?.driverId || season.winnerDriverId;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-white min-h-screen" data-testid="season-races-page">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-red-800 p-6 rounded-xl shadow-lg relative overflow-hidden">
        <FaFlagCheckered className="absolute top-4 left-4 text-white text-opacity-20 text-5xl transform -rotate-12" aria-hidden="true" />
        <FaFlagCheckered className="absolute bottom-4 right-4 text-white text-opacity-20 text-5xl transform rotate-12" aria-hidden="true" />

        <button
          onClick={() => navigate('/')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 mb-4 sm:mb-0 sm:mr-4 z-10"
          aria-label="Back to Seasons Overview"
          data-testid="back-button"
        >
          &larr; Back to Seasons
        </button>
        <div className="text-center sm:text-left flex-grow z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white" data-testid="season-title" style={{ fontFamily: 'Formula1, sans-serif' }}>
            <span className="text-yellow-400">RACES</span> - {season.year} SEASON
          </h1>
          {season.winner && (
            <p className="text-lg sm:text-xl font-medium text-gray-200 mt-2" data-testid="season-champion-display">
              Season Champion: <span className="text-yellow-400 font-semibold">{season.winner.givenName} {season.winner.familyName}</span>
            </p>
          )}
        </div>
      </header>

      {races?.length === 0 ? (
        <p className="text-center text-gray-400 text-lg mt-10" data-testid="no-races-message">No races found for this season.</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg" data-testid="races-table-container">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Round
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Race Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Circuit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Race Winner
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-700 divide-y divide-gray-600">
                {races?.map((race) => (
                  <RaceRow
                    key={race.round}
                    race={race}
                    isChampionWin={race.winnerDriverId === championId}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="block md:hidden" data-testid="races-card-container">
            {races?.map((race) => (
              <RaceCard
                key={race.round}
                race={race}
                isChampionWin={race.winnerDriverId === championId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  /* return (
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
  ); */
};

export default SeasonDetailsPage; 