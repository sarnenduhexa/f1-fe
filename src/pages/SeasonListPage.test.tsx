import { render, screen, fireEvent } from "@testing-library/react";
import SeasonListPage from "./SeasonListPage";
import * as seasonsApi from "../api/seasons/seasons";
import { vi, describe, it, afterEach, expect } from "vitest";
import type { Mock } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { SeasonProvider } from "../context/Season/SeasonProvidor";

vi.mock("../api/seasons/seasons");

const mockUseSeasonsControllerFindAll =
  seasonsApi.useSeasonsControllerFindAll as unknown as Mock;

describe("SeasonListPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
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
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseSeasonsControllerFindAll.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error("Test error"),
    });
    renderWithProviders(<SeasonListPage />);
    expect(screen.getByTestId("error")).toHaveTextContent("Test error");
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
    expect(screen.getAllByTestId(/champion-card-/)).toHaveLength(2);
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
    const card = screen.getByTestId('champion-card-2023');
    fireEvent.click(card);
    // No error means the click handler is wired up; full navigation is tested in ChampionCard
  });
});
