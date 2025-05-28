import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SeasonCard from '../SeasonCard';
import type { SeasonDto, DriverDto } from '../../api/f1DashboardAPI.schemas';

const mockDriver: DriverDto = {
  driverId: 'max',
  givenName: 'Max',
  familyName: 'Verstappen',
  nationality: 'Dutch',
  code: 'VER',
  url: 'https://example.com/driver',
  dateOfBirth: '1997-09-30'
};

const mockSeason: SeasonDto = {
  year: 2024,
  url: 'https://example.com/season/2024',
  winner: mockDriver
};

const mockSeasonWithoutWinner: SeasonDto = {
  year: 2024,
  url: 'https://example.com/season/2024'
};

describe('SeasonCard', () => {
  it('renders season information correctly', () => {
    render(<SeasonCard season={mockSeason} onClick={() => {}} />);
    
    // Check if year is rendered
    expect(screen.getByTestId('season-year-2024')).toHaveTextContent('2024');
    
    // Check if champion information is rendered
    const championInfo = screen.getByTestId('champion-info-2024');
    expect(championInfo).toHaveTextContent('Max Verstappen');
    expect(championInfo).toHaveTextContent('(VER)');
    expect(championInfo).toHaveTextContent('(Dutch)');
  });

  it('displays TBD message when no winner is available', () => {
    render(<SeasonCard season={mockSeasonWithoutWinner} onClick={() => {}} />);
    
    expect(screen.getByTestId('champion-tbd-2024')).toHaveTextContent('Could not fetch champion data');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<SeasonCard season={mockSeason} onClick={handleClick} />);
    
    const card = screen.getByTestId('season-card-2024');
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledWith(mockSeason);
  });

  it('calls onClick handler when Enter key is pressed', () => {
    const handleClick = vi.fn();
    render(<SeasonCard season={mockSeason} onClick={handleClick} />);
    
    const card = screen.getByTestId('season-card-2024');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(handleClick).toHaveBeenCalledWith(mockSeason);
  });

  it('calls onClick handler when Space key is pressed', () => {
    const handleClick = vi.fn();
    render(<SeasonCard season={mockSeason} onClick={handleClick} />);
    
    const card = screen.getByTestId('season-card-2024');
    fireEvent.keyDown(card, { key: ' ' });
    
    expect(handleClick).toHaveBeenCalledWith(mockSeason);
  });

  it('has correct accessibility attributes', () => {
    render(<SeasonCard season={mockSeason} onClick={() => {}} />);
    
    const card = screen.getByTestId('season-card-2024');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label', 'View details for 2024 Formula 1 season');
  });

  it('renders decorative elements with correct accessibility attributes', () => {
    render(<SeasonCard season={mockSeason} onClick={() => {}} />);
    
    const tireTracks = screen.getByTestId('tire-tracks');
    expect(tireTracks).toHaveAttribute('aria-hidden', 'true');
    
    const arrow = screen.getByTestId('double-arrow');
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
  });
}); 