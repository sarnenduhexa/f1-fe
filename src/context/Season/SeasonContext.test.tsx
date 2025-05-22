import { act, render, screen } from '@testing-library/react';
import { SeasonProvider } from './SeasonProvidor';
import { vi, describe, it, expect } from 'vitest';
import { useSeasonContext } from './SeasonContext';

const TestComponent = () => {
  const { selectedSeason, setSelectedSeason } = useSeasonContext();
  return (
    <div>
      <span data-testid="selected-season">{selectedSeason ? selectedSeason.year : 'none'}</span>
      <button onClick={() => setSelectedSeason({ year: 2022, url: '', winner: undefined })}>
        Set Season
      </button>
    </div>
  );
};

describe('SeasonContext', () => {
  it('provides and updates selected season', async () => {
    render(
      <SeasonProvider>
        <TestComponent />
      </SeasonProvider>
    );
    expect(screen.getByTestId('selected-season')).toHaveTextContent('none');
    
    await act(async () => {
        await screen.getByText('Set Season').click();
    });
    
    expect(screen.getByTestId('selected-season')).toHaveTextContent('2022');
  });

  it('throws error if used outside provider', () => {
    // Suppress error output for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const Broken = () => {
      useSeasonContext();
      return null;
    };
    expect(() => render(<Broken />)).toThrow();
    spy.mockRestore();
  });
}); 