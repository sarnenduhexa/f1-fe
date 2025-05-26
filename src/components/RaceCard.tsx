import { FaTrophy } from 'react-icons/fa';
import type { RaceDto } from '../api/f1DashboardAPI.schemas';

interface RaceCardProps {
  race: RaceDto;
  isChampionWin: boolean;
}

const RaceCard = ({ race, isChampionWin }: RaceCardProps) => {
  const { round, raceName, circuitName, date, winnerDriver } = race;

  return (
    <div
      data-testid={`race-card-${race.round}`}
      className={`
        bg-gradient-to-r from-gray-800 to-gray-700 shadow-md p-4 mb-4 relative overflow-hidden
        ${isChampionWin ? 'border-l-8 border-f1-yellow' : 'border-l-8 border-gray-600'}
        text-white
      `}
      role="listitem"
      aria-label={`Race Round ${round}: ${raceName}`}
    >
      <div className="absolute inset-0 bg-pattern-f1 opacity-5 pointer-events-none z-0"></div>

      <div className="flex justify-between items-center mb-2 relative z-10">
        <h3 className="text-xl font-bold text-white" data-testid={`race-name-${race.round}`}>
          Round {round}: {raceName}
        </h3>
        {isChampionWin && <FaTrophy className="text-f1-yellow text-2xl" title="Champion's Win" aria-label="Season Champion won this race" />}
      </div>
      <p data-testid={`circuit-name-${race.round}`} className="text-gray-300 text-sm mb-1 relative z-10">
        <span className="font-semibold">Circuit:</span> {circuitName}
      </p>
      <p data-testid={`date-${race.round}`} className="text-gray-300 text-sm mb-2 relative z-10">
        <span className="font-semibold">Date:</span> {new Date(date).toLocaleDateString()}
      </p>
      <div className="flex items-center text-gray-200 flex-wrap relative z-10">
        <span data-testid={`winner-${race.round}`}>
          <span className="font-semibold mr-1">Winner:</span>
          <span className="font-medium text-white">
            {winnerDriver?.givenName} {winnerDriver?.familyName}
          </span>
        </span>
        {winnerDriver?.nationality && (
          <span className="text-gray-400 text-xs ml-1">({winnerDriver?.nationality})</span>
        )}
        {winnerDriver?.code && (
          <span className="text-gray-400 text-xs ml-1">({winnerDriver?.code})</span>
        )}
        {winnerDriver?.url && (
            <a
                href={winnerDriver?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-400 hover:underline text-xs"
                aria-label={`Learn more about ${winnerDriver.givenName} ${winnerDriver.familyName}`}
            >
                (Bio)
            </a>
        )}
      </div>
        {race.url && (
            <div className="text-right mt-2 relative z-10">
                <a
                    href={race.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm"
                    aria-label={`View details for ${raceName}`}
                >
                    Race Details &rarr;
                </a>
            </div>
        )}
    </div>
  );
};

export default RaceCard;