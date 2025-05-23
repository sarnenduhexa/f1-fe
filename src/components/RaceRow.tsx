import { FaTrophy } from 'react-icons/fa';
import type { RaceDto } from '../api/f1DashboardAPI.schemas';

interface RaceRowProps {
  race: RaceDto;
  isChampionWin: boolean;
}

const RaceRow = ({ race, isChampionWin }: RaceRowProps) => {
  const { round, raceName, circuitName, date, winnerDriver } = race;

  const rowClasses = `
    border-b border-gray-600
    ${isChampionWin ? 'bg-f1-purple bg-opacity-30 font-semibold' : 'bg-gray-700'}
    hover:bg-gray-600 transition-colors duration-200 text-white
  `;

  return (
    <tr className={rowClasses} data-testid={`race-row-${race.round}`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {round}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {raceName}
        {race.url && (
            <a
                href={race.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-400 hover:underline text-xs"
                aria-label={`View details for ${raceName}`}
            >
                (Info)
            </a>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {circuitName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {new Date(date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center">
        {isChampionWin && <FaTrophy className="text-yellow-400 text-lg mr-2" aria-label="Season Champion won this race" />}
        <span>{winnerDriver?.givenName} {winnerDriver?.familyName}</span>
        {winnerDriver?.nationality && (
            <span className="text-gray-400 text-xs ml-2">({winnerDriver?.nationality})</span>
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
                aria-label={`Learn more about ${winnerDriver?.givenName} ${winnerDriver?.familyName}`}
            >
                (Bio)
            </a>
        )}
      </td>
    </tr>
  );
};

export default RaceRow;