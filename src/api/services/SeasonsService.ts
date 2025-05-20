/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SeasonDto } from '../models/SeasonDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SeasonsService {
    /**
     * Get all F1 seasons
     * @returns SeasonDto Returns all F1 seasons
     * @throws ApiError
     */
    public static seasonsControllerFindAll(): CancelablePromise<Array<SeasonDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seasons',
        });
    }
    /**
     * Get a specific F1 season by year
     * @param year
     * @returns SeasonDto Returns the F1 season for the specified year
     * @throws ApiError
     */
    public static seasonsControllerFindOne(
        year: number,
    ): CancelablePromise<SeasonDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/seasons/{year}',
            path: {
                'year': year,
            },
            errors: {
                404: `Season not found`,
            },
        });
    }
}
