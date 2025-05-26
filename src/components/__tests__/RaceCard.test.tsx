import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RaceCard from '../RaceCard';
import type { RaceDto } from '../../api/f1DashboardAPI.schemas';

const mockRace: RaceDto = {
  id: '1',
  season: 2024,
  round: 1,
  raceName: 'Australian Grand Prix',
  circuitName: 'Albert Park Circuit',
  date: '2024-03-24',
  url: 'https://example.com/race',
  winnerDriver: {
    driverId: 'max',
    givenName: 'Max',
    familyName: 'Verstappen',
    nationality: 'Dutch',
    code: 'VER',
    url: 'https://example.com/driver',
    dateOfBirth: '1997-09-30'
  }
};

describe('RaceCard', () => {
  it('renders race information correctly', () => {
    render(<RaceCard race={mockRace} isChampionWin={false} />);
    
    // Check if race name is rendered
    expect(screen.getByTestId('race-name-1')).toHaveTextContent('Round 1: Australian Grand Prix');
    
    // Check if circuit name is rendered
    expect(screen.getByTestId(`circuit-name-${mockRace.round}`)).toHaveTextContent('Circuit: Albert Park Circuit');
    
    // Check if date is rendered
    expect(screen.getByTestId(`date-${mockRace.round}`)).toHaveTextContent('Date: 3/24/2024');
    
    // Check if winner information is rendered
    expect(screen.getByTestId(`winner-${mockRace.round}`)).toHaveTextContent('Winner:Max Verstappen');
    expect(screen.getByText('(Dutch)')).toBeInTheDocument();
    expect(screen.getByText('(VER)')).toBeInTheDocument();
  });

  it('displays champion win indicator when isChampionWin is true', () => {
    render(<RaceCard race={mockRace} isChampionWin={true} />);
    
    const trophyIcon = screen.getByTitle('Champion\'s Win');
    expect(trophyIcon).toBeInTheDocument();
  });

  it('does not display champion win indicator when isChampionWin is false', () => {
    render(<RaceCard race={mockRace} isChampionWin={false} />);
    
    const trophyIcon = screen.queryByTitle('Champion\'s Win');
    expect(trophyIcon).not.toBeInTheDocument();
  });

  it('renders driver bio link when available', () => {
    render(<RaceCard race={mockRace} isChampionWin={false} />);
    
    const bioLink = screen.getByText('(Bio)');
    expect(bioLink).toBeInTheDocument();
    expect(bioLink).toHaveAttribute('href', 'https://example.com/driver');
    expect(bioLink).toHaveAttribute('target', '_blank');
    expect(bioLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders race details link when available', () => {
    render(<RaceCard race={mockRace} isChampionWin={false} />);
    
    const raceDetailsLink = screen.getByText('Race Details →');
    expect(raceDetailsLink).toBeInTheDocument();
    expect(raceDetailsLink).toHaveAttribute('href', 'https://example.com/race');
    expect(raceDetailsLink).toHaveAttribute('target', '_blank');
    expect(raceDetailsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles missing driver information gracefully', () => {
    const raceWithoutDriver = {
      ...mockRace,
      winnerDriver: undefined
    };
    
    render(<RaceCard race={raceWithoutDriver} isChampionWin={false} />);
    
    expect(screen.getByText(/Winner:/)).toBeInTheDocument();
    expect(screen.queryByText('(Bio)')).not.toBeInTheDocument();
  });
}); 