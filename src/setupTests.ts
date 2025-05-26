import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn().mockImplementation((key: string) => store[key] || null),
    setItem: vi.fn().mockImplementation((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock matchMedia
const matchMediaMock = () => ({
  matches: false,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn(matchMediaMock),
});

// Reset mocks before each test
beforeEach(() => {
  localStorageMock.clear();
  vi.resetAllMocks();
}); 