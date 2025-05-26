import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RaceRow from '../RaceRow';
import type { RaceDto, DriverDto } from '../../api/f1DashboardAPI.schemas';

const mockDriver: DriverDto = {
  driverId: 'max',
  givenName: 'Max',
  familyName: 'Verstappen',
  nationality: 'Dutch',
  code: 'VER',
  url: 'https://example.com/driver',
  dateOfBirth: '1997-09-30'
};

const mockRace: RaceDto = {
  id: 'race1',
  season: 2024,
  round: 1,
  raceName: 'Australian Grand Prix',
  circuitName: 'Albert Park Circuit',
  date: '2024-03-24',
  url: 'https://example.com/race',
  winnerDriver: mockDriver
};

describe('RaceRow', () => {
  it('renders race information correctly', () => {
    render(
      <table>
        <tbody>
          <RaceRow race={mockRace} isChampionWin={false} />
        </tbody>
      </table>
    );
    
    // Check if round is rendered
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Check if race name is rendered
    expect(screen.getByText('Australian Grand Prix')).toBeInTheDocument();
    
    // Check if circuit name is rendered
    expect(screen.getByText('Albert Park Circuit')).toBeInTheDocument();
    
    // Check if date is rendered
    expect(screen.getByText('3/24/2024')).toBeInTheDocument();
    
    // Check if winner information is rendered
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    expect(screen.getByText('(Dutch)')).toBeInTheDocument();
  });

  it('displays champion win indicator when isChampionWin is true', () => {
    render(
      <table>
        <tbody>
          <RaceRow race={mockRace} isChampionWin={true} />
        </tbody>
      </table>
    );
    
    const trophyIcon = screen.getByLabelText('Season Champion won this race');
    expect(trophyIcon).toBeInTheDocument();
  });

  it('does not display champion win indicator when isChampionWin is false', () => {
    render(
      <table>
        <tbody>
          <RaceRow race={mockRace} isChampionWin={false} />
        </tbody>
      </table>
    );
    
    const trophyIcon = screen.queryByLabelText('Season Champion won this race');
    expect(trophyIcon).not.toBeInTheDocument();
  });

  it('renders race info link when available', () => {
    render(
      <table>
        <tbody>
          <RaceRow race={mockRace} isChampionWin={false} />
        </tbody>
      </table>
    );
    
    const infoLink = screen.getByText('(Info)');
    expect(infoLink).toBeInTheDocument();
    expect(infoLink).toHaveAttribute('href', 'https://example.com/race');
    expect(infoLink).toHaveAttribute('target', '_blank');
    expect(infoLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(infoLink).toHaveAttribute('aria-label', 'View details for Australian Grand Prix');
  });

  it('renders driver bio link when available', () => {
    render(
      <table>
        <tbody>
          <RaceRow race={mockRace} isChampionWin={false} />
        </tbody>
      </table>
    );
    
    const bioLink = screen.getByText('(Bio)');
    expect(bioLink).toBeInTheDocument();
    expect(bioLink).toHaveAttribute('href', 'https://example.com/driver');
    expect(bioLink).toHaveAttribute('target', '_blank');
    expect(bioLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(bioLink).toHaveAttribute('aria-label', 'Learn more about Max Verstappen');
  });

  it('handles missing driver information gracefully', () => {
    const raceWithoutDriver = {
      ...mockRace,
      winnerDriver: undefined
    };
    
    render(
      <table>
        <tbody>
          <RaceRow race={raceWithoutDriver} isChampionWin={false} />
        </tbody>
      </table>
    );
    
    expect(screen.queryByText('(Bio)')).not.toBeInTheDocument();
    expect(screen.queryByText('(Dutch)')).not.toBeInTheDocument();
  });

  it('applies correct styling for champion win', () => {
    render(
      <table>
        <tbody>
          <RaceRow race={mockRace} isChampionWin={true} />
        </tbody>
      </table>
    );
    
    const row = screen.getByTestId('race-row-1');
    expect(row).toHaveClass('bg-f1-blue/80');
    expect(row).toHaveClass('text-stone-50');
  });
}); 