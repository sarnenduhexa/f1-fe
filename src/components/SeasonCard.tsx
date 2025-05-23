import { FaChevronRight, FaCrown } from "react-icons/fa";
import type { SeasonDto } from "../api/f1DashboardAPI.schemas";

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
        bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-xl p-6 relative
        border-l-4 border-red-600 transition-all duration-300 transform
        hover:scale-[1.02] hover:shadow-2xl hover:border-red-500
        cursor-pointer overflow-hidden
      "
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${year} Formula 1 season`}
    >
      <div className="absolute inset-0 bg-pattern-f1 opacity-5 pointer-events-none z-0"></div>

      <h2
        className="text-4xl font-extrabold text-white mb-3 relative z-10"
        data-testid={`season-year-${year}`}
      >
        {year} Season
      </h2>
      <div className="flex items-center text-gray-200 relative z-10 flex-wrap">
        <span className="text-xl font-semibold mr-2">World Champion:</span>
        {winner ? (
          <div
            className="flex items-center"
            data-testid={`champion-info-${year}`}
          >
            <FaCrown
              className="text-yellow-400 text-2xl mr-2 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-xl font-medium text-white">
              {winner.givenName} {winner.familyName}
            </span>
            {winner.nationality && (
              <span className="text-gray-300 text-sm ml-2">
                ({winner.nationality})
              </span>
            )}
            {winner.code && (
              <span className="text-gray-300 text-sm ml-1">
                ({winner.code})
              </span>
            )}
          </div>
        ) : (
          <span
            className="text-xl font-medium text-gray-400"
            data-testid={`champion-tbd-${year}`}
          >
            Champion TBD / Season In Progress
          </span>
        )}
      </div>

      <div className="absolute top-1/2 right-6 -translate-y-1/2 text-white text-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        <FaChevronRight aria-hidden="true" />
      </div>
    </div>
  );
};

export default SeasonCard;
