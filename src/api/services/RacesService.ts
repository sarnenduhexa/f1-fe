/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RaceDto } from '../models/RaceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RacesService {
    /**
     * Get all races for a specific season
     * @param season
     * @returns RaceDto Returns all races for the specified season
     * @throws ApiError
     */
    public static racesControllerFindBySeason(
        season: number,
    ): CancelablePromise<Array<RaceDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/races/season/{season}',
            path: {
                'season': season,
            },
        });
    }
}
