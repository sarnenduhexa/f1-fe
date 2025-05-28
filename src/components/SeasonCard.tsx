import { FaCrown } from "react-icons/fa";
import type { SeasonDto } from "../api/f1DashboardAPI.schemas";
import { GiTireTracks } from "react-icons/gi";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

interface SeasonCardProps {
  season: SeasonDto;
  onClick: (season: SeasonDto) => void;
}

const SeasonCard = ({ season, onClick }: SeasonCardProps) => {
  const { year, winner } = season;

  const handleCardClick = () => {
    onClick(season);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(season);
    }
  };

  return (
    <div
      data-testid={`season-card-${year}`}
      className="
        bg-gradient-to-r from-gray-900 to-gray-400 dark:from-slate-800 dark:to-slate-600 
        shadow-xl p-4 md:px-12 md:py-6 relative
        border-l-4 border-red-600 transition-all duration-300 transform
        hover:scale-[0.95] hover:shadow-2xl hover:border-red-500
        cursor-pointer overflow-hidden md:skew-x-[-8deg] border-r-2 border-r-black 
      "
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${year} Formula 1 season`}
    >
      <div className="absolute inset-0 bg-pattern-f1 opacity-5 pointer-events-none z-0"></div>

      <h2
        className="text-4xl font-extrabold text-gray-200 dark:text-white mb-3 relative z-10"
        data-testid={`season-year-${year}`}
      >
        {year} 
      </h2>
      <div className="flex items-center text-neutral-500 dark:text-gray-400 relative z-10 flex-wrap">
        <span className="text-xl font-semibold mr-2">World Champion:</span>
        {winner ? (
          <div
            className="flex items-baseline"
            data-testid={`champion-info-${year}`}
          >
            <FaCrown
              className="text-yellow-400 text-2xl mr-2 flex-shrink-0 align-self-center"
              aria-hidden="true"
            />
            <span className="text-xl font-medium text-white dark:text-gray-200">
              {winner.givenName} {winner.familyName}
            </span>
            {winner.code && (
              <div className="text-neutral-400 dark:text-zinc-100 text-sm ml-1">
                ({winner.code})
              </div>
            )}
            {winner.nationality && (
              <div className="text-neutral-300 dark:text-zinc-100 text-sm ml-2">
                ({winner.nationality})
              </div>
            )}
            
          </div>
        ) : (
          <span
            className="text-xl font-medium text-gray-400"
            data-testid={`champion-tbd-${year}`}
          >
            Could not fetch champion data
          </span>
        )}
      </div>

      <div className="absolute bottom-0 right-8 text-neutral-800/20 h-42 w-48 overflow-clip transform scale-165 -rotate-z-33 align-middle md:block hidden" aria-hidden="true">
        <GiTireTracks data-testid="tire-tracks" className="h-48 w-48" aria-hidden="true" />
      </div>

      <div className="absolute top-1/2 right-1 md:right-16 -translate-y-1/2 text-black dark:text-white text-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        <MdOutlineKeyboardDoubleArrowRight data-testid="double-arrow" className="h-18 w-18" aria-hidden="true" />
      </div>
    </div>
  );
};

export default SeasonCard;
