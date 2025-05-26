import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from '../Spinner';

describe('Spinner', () => {
  it('renders the spinner with correct styling', () => {
    render(<Spinner />);
    
    const spinnerContainer = screen.getByTestId('spinner');
    expect(spinnerContainer).toHaveClass('flex', 'justify-center', 'items-center', 'py-8');
    
    const spinner = spinnerContainer?.firstChild;
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'h-12',
      'w-12',
      'border-t-2',
      'border-b-2',
      'border-red-600'
    );
  });
}); 