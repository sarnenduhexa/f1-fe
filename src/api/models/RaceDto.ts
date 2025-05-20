/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RaceDto = {
    /**
     * Unique identifier for the race
     */
    id: string;
    /**
     * The season year
     */
    season: number;
    /**
     * The round number in the season
     */
    round: number;
    /**
     * Name of the race
     */
    raceName: string;
    /**
     * Name of the circuit
     */
    circuitName: string;
    /**
     * Date of the race
     */
    date: string;
    /**
     * Time of the race
     */
    time?: string;
    /**
     * URL to race details
     */
    url?: string;
};

