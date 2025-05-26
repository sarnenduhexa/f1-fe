import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme, ThemeContext } from '../ThemeContext';

describe('ThemeContext', () => {
  it('throws error when useTheme is used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('returns context value when used within ThemeProvider', () => {
    const mockContext = {
      theme: 'light' as const,
      toggleTheme: () => {}
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={mockContext}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });
    
    expect(result.current).toBe(mockContext);
    expect(result.current.theme).toBe('light');
    expect(typeof result.current.toggleTheme).toBe('function');
  });
}); 