/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DriverDto } from './DriverDto';
export type SeasonDto = {
    /**
     * The year of the F1 season
     */
    year: number;
    /**
     * The URL to the season details
     */
    url: string;
    /**
     * The driver who won the season
     */
    winner?: DriverDto;
};

