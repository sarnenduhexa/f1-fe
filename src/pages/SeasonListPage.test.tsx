import { render, screen } from '@testing-library/react';
import SeasonListPage from './SeasonListPage';
import * as seasonsApi from '../api/seasons/seasons';
import { vi, describe, it, afterEach, expect } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('../api/seasons/seasons');

const mockUseSeasonsControllerFindAll = seasonsApi.useSeasonsControllerFindAll as unknown as Mock;

describe('SeasonListPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({ isLoading: true });
    render(<SeasonListPage />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({ isLoading: false, isError: true, error: new Error('Test error') });
    render(<SeasonListPage />);
    expect(screen.getByTestId('error')).toHaveTextContent('Test error');
  });

  it('renders empty state', () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({ isLoading: false, isError: false, data: [] });
    render(<SeasonListPage />);
    expect(screen.getByTestId('empty')).toBeInTheDocument();
  });
}); 