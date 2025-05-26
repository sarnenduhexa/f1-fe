import { describe, it, expect, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '../ThemeContext';

// Test component that uses the theme
function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme-value">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

describe('ThemeProvider', () => {

  it('initializes with light theme when no saved theme and no dark mode preference', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
  });

  it('initializes with dark theme when user prefers dark mode', () => {
    (window.matchMedia as Mock).mockImplementation(() => ({
      matches: true,
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
  });

  it('initializes with saved theme from localStorage', () => {
    (localStorage.getItem as Mock).mockReturnValue('dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
  });

  it('toggles theme when toggleTheme is called', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial state
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    
    // Toggle theme
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    
    // Toggle back
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
  });

  it('updates localStorage when theme changes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial state
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    
    // Toggle theme
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('updates document class when theme changes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial state
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    
    // Toggle theme
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
}); 