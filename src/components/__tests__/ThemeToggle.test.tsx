import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeContext } from '../../context/Theme/ThemeContext';

describe('ThemeToggle', () => {
  it('renders the theme toggle button with correct initial state', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme: vi.fn() }}>
        <ThemeToggle />
      </ThemeContext.Provider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(button).toHaveClass('p-2', 'rounded-lg', 'bg-gray-700', 'dark:bg-gray-200', 'cursor-pointer');
  });

  it('displays moon icon in light mode', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme: vi.fn() }}>
        <ThemeToggle />
      </ThemeContext.Provider>
    );
    
    const moonIcon = screen.getByTestId('moon-icon');
    expect(moonIcon).toBeInTheDocument();

    const sunIcon = screen.queryByTestId('sun-icon');
    expect(sunIcon).not.toBeInTheDocument();
  });

  it('displays sun icon in dark mode', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: vi.fn() }}>
        <ThemeToggle />
      </ThemeContext.Provider>
    );

    const sunIcon = screen.getByTestId('sun-icon');
    expect(sunIcon).toBeInTheDocument();

    const moonIcon = screen.queryByTestId('moon-icon');
    expect(moonIcon).not.toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', () => {
    const mockToggleTheme = vi.fn();
    render(
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme: mockToggleTheme }}>
        <ThemeToggle />
      </ThemeContext.Provider>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('updates aria-label based on current theme', () => {
    const { rerender } = render(
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme: vi.fn() }}>
        <ThemeToggle />
      </ThemeContext.Provider>
    );
    
    // Initial state (light theme)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
    
    // Update to dark theme
    rerender(
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: vi.fn() }}>
        <ThemeToggle />
      </ThemeContext.Provider>
    );
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
  });
}); 