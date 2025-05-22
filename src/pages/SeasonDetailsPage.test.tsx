import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SeasonDetailsPage from './SeasonDetailsPage';
import * as seasonsApi from '../api/seasons/seasons';
import * as racesApi from '../api/races/races';
import { SeasonProvider } from '../context/Season/SeasonProvidor';

vi.mock('../api/seasons/seasons');
vi.mock('../api/races/races');

const mockUseSeasonsControllerFindOne = seasonsApi.useSeasonsControllerFindOne as unknown as ReturnType<typeof vi.fn>;
const mockUseRacesControllerFindBySeason = racesApi.useRacesControllerFindBySeason as unknown as ReturnType<typeof vi.fn>;

const renderWithProviders = (route = '/season/2023') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <SeasonProvider>
        <Routes>
          <Route path="/season/:seasonId" element={<SeasonDetailsPage />} />
        </Routes>
      </SeasonProvider>
    </MemoryRouter>
  );

describe('SeasonDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseSeasonsControllerFindOne.mockReturnValue({ isLoading: true });
    mockUseRacesControllerFindBySeason.mockReturnValue({ isLoading: true });
    renderWithProviders();
    expect(screen.getByText(/Loading season details/i)).toBeInTheDocument();
  });

  it('renders error state for season', () => {
    mockUseSeasonsControllerFindOne.mockReturnValue({ isLoading: false, isError: true, error: 'Season error' });
    mockUseRacesControllerFindBySeason.mockReturnValue({ isLoading: false });
    renderWithProviders();
    expect(screen.getByText(/Error loading season/i)).toBeInTheDocument();
  });

  it('renders error state for races', () => {
    mockUseSeasonsControllerFindOne.mockReturnValue({ isLoading: false });
    mockUseRacesControllerFindBySeason.mockReturnValue({ isLoading: false, isError: true, error: 'Races error' });
    renderWithProviders();
    expect(screen.getByText(/Error loading races/i)).toBeInTheDocument();
  });

  it('renders not found if no season', () => {
    mockUseSeasonsControllerFindOne.mockReturnValue({ isLoading: false, data: null });
    mockUseRacesControllerFindBySeason.mockReturnValue({ isLoading: false });
    renderWithProviders();
    expect(screen.getByText(/Season not found/i)).toBeInTheDocument();
  });

  it('renders champion and highlights champion wins', () => {
    mockUseSeasonsControllerFindOne.mockReturnValue({
      isLoading: false,
      data: {
        year: 2023,
        url: '',
        winner: { driverId: '1', givenName: 'Max', familyName: 'Verstappen', nationality: 'Dutch', url: '', dateOfBirth: '1997-09-30' },
        winnerDriverId: '1',
      },
    });
    mockUseRacesControllerFindBySeason.mockReturnValue({
      isLoading: false,
      data: [
        {
          id: 'r1',
          season: 2023,
          round: 1,
          raceName: 'Bahrain GP',
          circuitName: 'Bahrain',
          date: '2023-03-05',
          winnerDriverId: '1',
          winnerDriver: { driverId: '1', givenName: 'Max', familyName: 'Verstappen', nationality: 'Dutch', url: '', dateOfBirth: '1997-09-30' },
        },
        {
          id: 'r2',
          season: 2023,
          round: 2,
          raceName: 'Saudi GP',
          circuitName: 'Jeddah',
          date: '2023-03-19',
          winnerDriverId: '2',
          winnerDriver: { driverId: '2', givenName: 'Sergio', familyName: 'Perez', nationality: 'Mexican', url: '', dateOfBirth: '1990-01-26' },
        },
      ],
    });
    renderWithProviders();
    expect(screen.getByText('2023 Champion')).toBeInTheDocument();
    expect(screen.getAllByText('Max Verstappen')).toHaveLength(2);
    expect(screen.getAllByTestId('champion-win')).toHaveLength(1);
    expect(screen.getByText('Bahrain GP')).toBeInTheDocument();
    expect(screen.getByText('Saudi GP')).toBeInTheDocument();
  });
}); 