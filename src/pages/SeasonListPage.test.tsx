import { render, screen, fireEvent } from "@testing-library/react";
import SeasonListPage from "./SeasonListPage";
import * as seasonsApi from "../api/seasons/seasons";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Mock } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { SeasonContext } from "../context/Season/SeasonContext";

const mockNavigate = vi.fn();
vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock("../api/seasons/seasons");

const mockUseSeasonsControllerFindAll =
  seasonsApi.useSeasonsControllerFindAll as unknown as Mock;

// Mock the SeasonContext
vi.mock(import("../context/Season/SeasonContext"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useSeasonContext: () => ({
      setSelectedSeason: vi.fn(),
    }),
  }
})

// Mock the ThemeToggle component
vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

const SeasonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    selectedSeason: null,
    setSelectedSeason: vi.fn(),
  };
  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
};

describe("SeasonListPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) =>
    render(
      <MemoryRouter>
        <SeasonProvider>{ui}</SeasonProvider>
      </MemoryRouter>
    );

  it("renders loading state", () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({ isLoading: true });
    renderWithProviders(<SeasonListPage />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error("Test error"),
    });
    renderWithProviders(<SeasonListPage />);
    expect(screen.getByTestId("error-message-container")).toHaveTextContent("Test error");
  });

  it("renders empty state", () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({ isLoading: false, isError: false, data: [] });
    renderWithProviders(<SeasonListPage />);
    expect(screen.getByTestId("empty")).toBeInTheDocument();
  });

  it("renders multiple seasons", () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        { year: 2023, url: '', winner: { driverId: '1', givenName: 'Max', familyName: 'Verstappen', nationality: 'Dutch', url: '', dateOfBirth: '1997-09-30' } },
        { year: 2022, url: '', winner: { driverId: '2', givenName: 'Lewis', familyName: 'Hamilton', nationality: 'British', url: '', dateOfBirth: '1985-01-07' } },
      ],
    });
    renderWithProviders(<SeasonListPage />);
    expect(screen.getAllByTestId(/season-card-/)).toHaveLength(2);
    expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
    expect(screen.getByText('Lewis Hamilton')).toBeInTheDocument();
  });

  it("navigates to details page on card click", () => {
    // This is a smoke test; full navigation is tested in ChampionCard
    mockUseSeasonsControllerFindAll.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        { year: 2023, url: '', winner: { driverId: '1', givenName: 'Max', familyName: 'Verstappen', nationality: 'Dutch', url: '', dateOfBirth: '1997-09-30' } },
      ],
    });
    renderWithProviders(<SeasonListPage />);
    const card = screen.getByTestId('season-card-2023');
    fireEvent.click(card);
    // No error means the click handler is wired up; full navigation is tested in ChampionCard
    expect(mockNavigate).toHaveBeenCalledWith('/season/2023');
  });
});
