import { render, screen, fireEvent } from '@testing-library/react';
import ChampionCard from './ChampionCard';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { SeasonDto } from '../api/f1DashboardAPI.schemas';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SeasonProvider } from '../context/Season/SeasonProvidor';

// Mock useNavigate at the module level
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

describe('ChampionCard', () => {
  const renderWithProviders = (ui: React.ReactElement) =>
    render(
      <MemoryRouter>
        <SeasonProvider>{ui}</SeasonProvider>
      </MemoryRouter>
    );

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders champion info', () => {
    const season: SeasonDto = {
      year: 2023,
      url: '',
      winner: {
        driverId: '1',
        givenName: 'Max',
        familyName: 'Verstappen',
        nationality: 'Dutch',
        url: '',
        dateOfBirth: '1997-09-30',
      },
    };
    renderWithProviders(<ChampionCard season={season} onSelect={() => {}} />);
    expect(screen.getByTestId('champion-year')).toHaveTextContent('2023');
    expect(screen.getByTestId('champion-name')).toHaveTextContent('Max Verstappen');
    expect(screen.getByTestId('champion-nationality')).toHaveTextContent('Dutch');
  });

  it('renders no winner message if winner is missing', () => {
    const season: SeasonDto = {
      year: 2022,
      url: '',
    };
    renderWithProviders(<ChampionCard season={season} onSelect={() => {}} />);
    expect(screen.getByText('No winner data')).toBeInTheDocument();
  });

  it('is accessible as a button', () => {
    const season: SeasonDto = {
      year: 2021,
      url: '',
      winner: {
        driverId: '2',
        givenName: 'Lewis',
        familyName: 'Hamilton',
        nationality: 'British',
        url: '',
        dateOfBirth: '1985-01-07',
      },
    };
    renderWithProviders(<ChampionCard season={season} onSelect={() => {}} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabindex', '0');
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('2021'));
  });

  it('calls onSelect on click', () => {
    const season: SeasonDto = {
      year: 2020,
      url: '',
      winner: {
        driverId: '3',
        givenName: 'Sebastian',
        familyName: 'Vettel',
        nationality: 'German',
        url: '',
        dateOfBirth: '1987-07-03',
      },
    };
    const onSelect = vi.fn();
    renderWithProviders(<ChampionCard season={season} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('calls onSelect on Enter/Space keydown', () => {
    const season: SeasonDto = {
      year: 2019,
      url: '',
      winner: {
        driverId: '4',
        givenName: 'Charles',
        familyName: 'Leclerc',
        nationality: 'Monegasque',
        url: '',
        dateOfBirth: '1997-10-16',
      },
    };
    const onSelect = vi.fn();
    renderWithProviders(<ChampionCard season={season} onSelect={onSelect} />);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalled();
    fireEvent.keyDown(card, { key: ' ' });
    expect(onSelect).toHaveBeenCalled();
  });

  it('handles edge-case winner data', () => {
    const season: SeasonDto = {
      year: 2018,
      url: '',
      winner: {
        driverId: '5',
        givenName: '',
        familyName: '',
        nationality: '',
        url: '',
        dateOfBirth: '',
      },
    };
    renderWithProviders(<ChampionCard season={season} onSelect={() => {}} />);
    expect(screen.getByTestId('champion-name')).toHaveTextContent('');
    expect(screen.getByTestId('champion-nationality')).toHaveTextContent('');
  });
}); 