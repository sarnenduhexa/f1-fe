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
    ${isChampionWin ? 'bg-f1-blue/80 text-stone-50' : ''}
    text-black dark:text-white 
  `;

  const infoLinkClasses = `
    ml-2 hover:underline text-xs 
    ${isChampionWin ? 'text-amber-400' : 'text-blue-600 dark:text-blue-300'}
  `;

  return (
    <tr className={rowClasses} data-testid={`race-row-${race.round}`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
        {round}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {raceName}
        {race.url && (
            <a
                href={race.url}
                target="_blank"
                rel="noopener noreferrer"
                className={infoLinkClasses}
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
      <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center flex-col">
        
        <div className='text-md uppercase'>
          {winnerDriver ? (<div
            className='flex items-center justify-center gap-2 flex-row text-shadow-md tracking-wide'
          >{isChampionWin && <FaTrophy className="text-f1-yellow text-lg mr-2" aria-label="Season Champion won this race" />}
          {winnerDriver?.givenName} {winnerDriver?.familyName}</div>) : (<div
            className='flex items-center justify-center gap-2 flex-row text-shadow-md tracking-wide'
          >Could not fetch winner data</div>)}
        </div>

        <div className='gap-1 inline-flex mt-1'>
          {winnerDriver?.nationality && (
              <div className="text-xs ml-2">({winnerDriver?.nationality})</div>
          )}
        
          {winnerDriver?.url && ( 
              <a
                  href={winnerDriver?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={infoLinkClasses}
                  aria-label={`Learn more about ${winnerDriver?.givenName} ${winnerDriver?.familyName}`}
              >
                  (Bio)
              </a>
          )}
        </div>
      </td>
    </tr>
  );
};

export default RaceRow;