import { render, screen } from '@testing-library/react';
import ChampionCard from './ChampionCard';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { SeasonDto } from '../api/f1DashboardAPI.schemas';
import { describe, it, expect } from 'vitest';

describe('ChampionCard', () => {
  const renderWithRouter = (ui: React.ReactElement) =>
    render(<BrowserRouter>{ui}</BrowserRouter>);

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
}); 