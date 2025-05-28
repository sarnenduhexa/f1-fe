import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useParams } from 'react-router-dom';
import { SeasonContext, useSeasonContext } from '../context/Season/SeasonContext';
import SeasonDetailsPage from './SeasonDetailsPage';
import { useSeasonsControllerFindOne } from '../api/seasons/seasons';
import { useRacesControllerFindBySeason } from '../api/races/races';
import type { SeasonDto } from '../api/f1DashboardAPI.schemas';

vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useParams: vi.fn(),
  }
})

// Mock the API hooks
vi.mock('../api/seasons/seasons', () => ({
  useSeasonsControllerFindOne: vi.fn(() => ({
    data: undefined,
    isLoading: true,
    isError: false,
    error: null,
  })),
}));

vi.mock('../api/races/races', () => ({
  useRacesControllerFindBySeason: vi.fn(() => ({
    data: undefined,
    isLoading: true,
    isError: false,
    error: null,
  })),
}));

// Mock the SeasonContext
vi.mock(import("../context/Season/SeasonContext"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useSeasonContext: vi.fn(() => ({
      ...actual.useSeasonContext(),
      selectedSeason: null,
    })),
  }
})

// Mock the ThemeToggle component
vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

const mockSeason = {
  year: 2023,
  winner: {
    driverId: 'VER',
    givenName: 'Max',
    familyName: 'Verstappen',
  },
};

const mockRaces = [
  {
    round: 1,
    raceName: 'Bahrain Grand Prix',
    circuit: {
      circuitName: 'Bahrain International Circuit',
    },
    date: '2023-03-05',
    winnerDriverId: 'VER',
  },
  {
    round: 2,
    raceName: 'Saudi Arabian Grand Prix',
    circuit: {
      circuitName: 'Jeddah Corniche Circuit',
    },
    date: '2023-03-19',
    winnerDriverId: 'PER',
  },
];

const SeasonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    selectedSeason: null,
    setSelectedSeason: vi.fn(),
  };
  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
};

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <MemoryRouter>
      <SeasonProvider>{component}</SeasonProvider>
    </MemoryRouter>
  );
};

describe('SeasonDetailsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ seasonId: '2023' });
  });

  it('renders loading spinner when data is loading', () => {
    vi.mocked(useSeasonsControllerFindOne).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    renderWithRouter(<SeasonDetailsPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders season error message when there is a season error', () => {
    vi.mocked(useSeasonsControllerFindOne).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch season'),
    } as unknown as any);

    vi.mocked(useRacesControllerFindBySeason).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    renderWithRouter(<SeasonDetailsPage />);
    expect(screen.getByTestId('season-error-message-container')).toBeInTheDocument();
  });

  it('renders races error message when there is a races error', () => {
    vi.mocked(useSeasonsControllerFindOne).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    vi.mocked(useRacesControllerFindBySeason).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch races'),
    } as unknown as any);

    renderWithRouter(<SeasonDetailsPage />);
    expect(screen.getByTestId('race-error-message-container')).toBeInTheDocument();
  });

  it('renders season not found message when season is not available', () => {
    vi.mocked(useSeasonsControllerFindOne).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);
    vi.mocked(useRacesControllerFindBySeason).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    renderWithRouter(<SeasonDetailsPage />);
    expect(screen.getByTestId('season-not-found-message')).toBeInTheDocument();
  });

  it('renders season details and races when data is available', () => {
    vi.mocked(useSeasonsControllerFindOne).mockReturnValue({
      data: mockSeason,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    vi.mocked(useRacesControllerFindBySeason).mockReturnValue({
      data: mockRaces,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    renderWithRouter(<SeasonDetailsPage />);
    
    // Check header content
    expect(screen.getByTestId('season-title')).toBeInTheDocument();
    expect(screen.getByTestId('season-champion-display')).toBeInTheDocument();
    expect(screen.getByText('Season Champion:')).toBeInTheDocument();
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    
    // Check back button
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    
    // Check theme toggle
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    
    // Check races content
    expect(screen.getByTestId('races-table-container')).toBeInTheDocument();
    expect(screen.getByTestId('races-card-container')).toBeInTheDocument();
  });

  it('navigates back to seasons list when back button is clicked', () => {
    vi.mocked(useSeasonsControllerFindOne).mockReturnValue({
      data: mockSeason,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    vi.mocked(useRacesControllerFindBySeason).mockReturnValue({
      data: mockRaces,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    renderWithRouter(<SeasonDetailsPage />);
    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);
    expect(window.location.pathname).toBe('/');
  });

  it('renders no races message when races array is empty', () => {
    vi.mocked(useSeasonsControllerFindOne).mockReturnValue({
      data: mockSeason,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    vi.mocked(useRacesControllerFindBySeason).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    renderWithRouter(<SeasonDetailsPage />);
    expect(screen.getByTestId('no-races-message')).toBeInTheDocument();
    expect(screen.getByText('No races found for this season.')).toBeInTheDocument();
  });

  it('fetches season data when winnerDriverId is missing', () => {
    const seasonWithoutWinner = {
      year: 2023,
      url: 'https://www.formula1.com/en/results.html/2023/races/2023-bahrain-grand-prix/results.html',
    };

    vi.mocked(useSeasonsControllerFindOne).mockReturnValue({
      data: mockSeason,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    vi.mocked(useRacesControllerFindBySeason).mockReturnValue({
      data: mockRaces,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    vi.mocked(useSeasonContext).mockReturnValue({
      selectedSeason: seasonWithoutWinner,
      setSelectedSeason: vi.fn(),
    });

    renderWithRouter(<SeasonDetailsPage />);
    
    // Verify that useSeasonsControllerFindOne was called with enabled: true
    expect(useSeasonsControllerFindOne).toHaveBeenCalledWith(expect.any(Number), {
      query: { enabled: true }
    });
  });

  it('fetches season data when season is not present in context', () => {
    vi.mocked(useSeasonsControllerFindOne).mockReturnValue({
      data: mockSeason,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    vi.mocked(useRacesControllerFindBySeason).mockReturnValue({
      data: mockRaces,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    // Mock the SeasonContext to return null season
    vi.mocked(useSeasonContext).mockReturnValue({
      selectedSeason: null,
      setSelectedSeason: vi.fn(),
    });

    renderWithRouter(<SeasonDetailsPage />);
    
    // Verify that useSeasonsControllerFindOne was called with enabled: true
    expect(useSeasonsControllerFindOne).toHaveBeenCalledWith(expect.any(Number), {
      query: { enabled: true }
    });
  });

  it('does not fetch season data when season with driver data is present in context', () => {
    const seasonWithWinner = {
      year: 2023,
      url: 'https://www.formula1.com/en/results.html/2023/races/2023-bahrain-grand-prix/results.html',
      winner: {
        driverId: 'VER',
        givenName: 'Max',
        familyName: 'Verstappen',
      },
      winnerDriverId: 'VER'
    };

    vi.mocked(useSeasonsControllerFindOne).mockReturnValue({
      data: mockSeason,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    vi.mocked(useRacesControllerFindBySeason).mockReturnValue({
      data: mockRaces,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as any);

    // Mock the SeasonContext to return a season with winner data
    vi.mocked(useSeasonContext).mockReturnValue({
      selectedSeason: seasonWithWinner as SeasonDto,
      setSelectedSeason: vi.fn(),
    });

    renderWithRouter(<SeasonDetailsPage />);
    
    // Verify that useSeasonsControllerFindOne was called with enabled: false
    expect(useSeasonsControllerFindOne).toHaveBeenCalledWith(2023, {
      query: { enabled: false }
    });
  });
}); 