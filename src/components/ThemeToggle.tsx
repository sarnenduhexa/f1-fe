import { useTheme } from '../context/Theme/ThemeContext';
import { GoMoon, GoSun } from "react-icons/go";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      data-testid="theme-toggle"
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-700 dark:bg-gray-200 cursor-pointer"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        // Moon icon for dark mode
        <GoMoon data-testid="moon-icon" className="w-5 h-5 text-gray-200"/>
      ) : (
        // Sun icon for light mode
        <GoSun data-testid="sun-icon" className="w-5 h-5 text-amber-800"/>
      )}
    </button>
  );
} 