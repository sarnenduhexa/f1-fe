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
import { ThemeToggle } from '../components/ThemeToggle';

const SeasonDetailsPage: React.FC = () => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const { selectedSeason } = useSeasonContext();
  const [season, setSeason] = useState<SeasonDto | null>(selectedSeason);
  const navigate = useNavigate();

  // Fetch season if not in context (deep link/refresh)
  // or if the season has no winner driver id
  const {
    data: fetchedSeason,
    isLoading: isSeasonLoading,
    isError: isSeasonError,
    error: seasonError,
  } = useSeasonsControllerFindOne(Number(seasonId!), {
    query: { enabled: !season || !season.winnerDriverId },
  });

  useEffect(() => {
    if (!season && fetchedSeason) {
      setSeason(fetchedSeason);
    }
  }, [season, fetchedSeason]);

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
    <div className="w-full mx-auto px-4 py-4 bg-gray-100 dark:bg-gray-900 text-white min-h-screen" data-testid="season-races-page">
      
      <header className="flex flex-col sm:flex-row justify-between items-center p-6 shadow-lg relative overflow-hidden mb-2 bg-f1-red">
        <div className='absolute top-2 right-2 z-10'>
          <ThemeToggle />
        </div>
        <FaFlagCheckered className="absolute top-4 left-4 text-white text-opacity-20 text-5xl transform -rotate-12" aria-hidden="true" />
        <FaFlagCheckered className="absolute bottom-4 right-4 text-white text-opacity-20 text-5xl transform rotate-12" aria-hidden="true" />

        <div className="text-center sm:text-left flex-grow z-10 mx-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold " data-testid="season-title">
            <span className="text-f1-yellow">RACES</span> <span className='text-white text-shadow-lg'>- SEASON {season.year} </span>
          </h1>
          {season.winner && (
            <div className="text-lg sm:text-xl font-medium text-gray-100 mt-2" data-testid="season-champion-display">
              <span>Season Champion: </span><span className="text-f1-yellow font-semibold text-3xl text-shadow-lg">{season.winner.givenName} {season.winner.familyName}</span>
            </div>
          )}
        </div>
      </header>

      <button
          onClick={() => void navigate('/')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors my-8 cursor-pointer"
          aria-label="Back to Seasons Overview"
          data-testid="back-button"
        >
          &larr; Back to Seasons
      </button>

      {races?.length === 0 ? (
        <p className="text-center text-gray-400 text-lg mt-10" data-testid="no-races-message">No races found for this season.</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto shadow-lg" data-testid="races-table-container">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-slate-600 text-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Round
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Race Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Circuit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Race Winner
                  </th>
                </tr>
              </thead>
              <tbody className="bg-stone-100 dark:bg-gray-700 divide-y divide-gray-600">
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
};

export default SeasonDetailsPage; 