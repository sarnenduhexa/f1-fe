import { render, screen, fireEvent } from '@testing-library/react';
import ChampionCard from './ChampionCard';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { SeasonDto } from '../api/f1DashboardAPI.schemas';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useNavigate at the module level
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

describe('ChampionCard', () => {
  const renderWithRouter = (ui: React.ReactElement) =>
    render(<BrowserRouter>{ui}</BrowserRouter>);

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
    renderWithRouter(<ChampionCard season={season} />);
    expect(screen.getByTestId('champion-year')).toHaveTextContent('2023');
    expect(screen.getByTestId('champion-name')).toHaveTextContent('Max Verstappen');
    expect(screen.getByTestId('champion-nationality')).toHaveTextContent('Dutch');
  });

  it('renders no winner message if winner is missing', () => {
    const season: SeasonDto = {
      year: 2022,
      url: '',
    };
    renderWithRouter(<ChampionCard season={season} />);
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
    renderWithRouter(<ChampionCard season={season} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabindex', '0');
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('2021'));
  });

  it('navigates on click', () => {
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
    renderWithRouter(<ChampionCard season={season} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/season/2020');
  });

  it('navigates on Enter/Space keydown', () => {
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
    renderWithRouter(<ChampionCard season={season} />);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/season/2019');
    fireEvent.keyDown(card, { key: ' ' });
    expect(mockNavigate).toHaveBeenCalledWith('/season/2019');
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
    renderWithRouter(<ChampionCard season={season} />);
    //This works because internally toHaveTextContent ignores trailing whitespace
    expect(screen.getByTestId('champion-name')).toHaveTextContent('');
    expect(screen.getByTestId('champion-nationality')).toHaveTextContent('');
  });
}); 