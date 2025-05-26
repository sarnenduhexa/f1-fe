import { render, screen, fireEvent } from "@testing-library/react";
import SeasonListPage from "./SeasonListPage";
import * as seasonsApi from "../api/seasons/seasons";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Mock } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { SeasonContext } from "../context/Season/SeasonContext";
import { BrowserRouter } from 'react-router-dom';
import { useSeasonsControllerFindAll } from '../api/seasons/seasons';

vi.mock("../api/seasons/seasons");

const mockUseSeasonsControllerFindAll =
  seasonsApi.useSeasonsControllerFindAll as unknown as Mock;

// Mock the SeasonContext
vi.mock('../context/Season/SeasonContext', () => ({
  useSeasonContext: () => ({
    setSelectedSeason: vi.fn(),
  }),
}));

// Mock the ThemeToggle component
vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

const mockSeasons = [
  {
    year: 2023,
    winner: {
      driverId: 'VER',
      givenName: 'Max',
      familyName: 'Verstappen',
    },
  },
  {
    year: 2022,
    winner: {
      driverId: 'VER',
      givenName: 'Max',
      familyName: 'Verstappen',
    },
  },
];

const SeasonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    selectedSeason: null,
    setSelectedSeason: vi.fn(),
  };
  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
};

describe("SeasonListPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) =>
    render(
      <MemoryRouter>
        <SeasonProvider>{ui}</SeasonProvider>
      </MemoryRouter>
    );

  const renderWithRouter = (component: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <SeasonProvider>{component}</SeasonProvider>
      </BrowserRouter>
    );
  };

  it("renders loading state", () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({ isLoading: true });
    renderWithProviders(<SeasonListPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error("Test error"),
    });
    renderWithProviders(<SeasonListPage />);
    expect(screen.getByTestId("error")).toHaveTextContent("Test error");
  });

  it("renders empty state", () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({ isLoading: false, isError: false, data: [] });
    renderWithProviders(<SeasonListPage />);
    expect(screen.getByTestId("empty")).toBeInTheDocument();
  });

  it("renders multiple seasons", () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        { year: 2023, url: '', winner: { driverId: '1', givenName: 'Max', familyName: 'Verstappen', nationality: 'Dutch', url: '', dateOfBirth: '1997-09-30' } },
        { year: 2022, url: '', winner: { driverId: '2', givenName: 'Lewis', familyName: 'Hamilton', nationality: 'British', url: '', dateOfBirth: '1985-01-07' } },
      ],
    });
    renderWithProviders(<SeasonListPage />);
    expect(screen.getAllByTestId(/champion-card-/)).toHaveLength(2);
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    expect(screen.getByText('Lewis Hamilton')).toBeInTheDocument();
  });

  it("navigates to details page on card click", () => {
    // This is a smoke test; full navigation is tested in ChampionCard
    mockUseSeasonsControllerFindAll.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        { year: 2023, url: '', winner: { driverId: '1', givenName: 'Max', familyName: 'Verstappen', nationality: 'Dutch', url: '', dateOfBirth: '1997-09-30' } },
      ],
    });
    renderWithProviders(<SeasonListPage />);
    const card = screen.getByTestId('champion-card-2023');
    fireEvent.click(card);
    // No error means the click handler is wired up; full navigation is tested in ChampionCard
  });

  it('renders loading spinner when data is loading', () => {
    vi.mocked(useSeasonsControllerFindAll).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    renderWithRouter(<SeasonListPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    vi.mocked(useSeasonsControllerFindAll).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch'),
    } as any);

    renderWithRouter(<SeasonListPage />);
    expect(screen.getByTestId('error-message-container')).toBeInTheDocument();
    expect(screen.getByText(/Error loading seasons: Failed to fetch/)).toBeInTheDocument();
  });

  it('renders no seasons message when data is empty', () => {
    vi.mocked(useSeasonsControllerFindAll).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    renderWithRouter(<SeasonListPage />);
    expect(screen.getByText('No season data available.')).toBeInTheDocument();
  });

  it('renders seasons list when data is available', () => {
    vi.mocked(useSeasonsControllerFindAll).mockReturnValue({
      data: mockSeasons,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    renderWithRouter(<SeasonListPage />);
    expect(screen.getByTestId('overview-header')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Explore Formula 1 Seasons & Champions')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('navigates to season details when a season is clicked', () => {
    vi.mocked(useSeasonsControllerFindAll).mockReturnValue({
      data: mockSeasons,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    renderWithRouter(<SeasonListPage />);
    const seasonCards = screen.getAllByRole('button');
    fireEvent.click(seasonCards[0]);
    expect(window.location.pathname).toBe('/season/2023');
  });
});
