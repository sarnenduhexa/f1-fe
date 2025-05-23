/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * F1 Dashboard API
 * The F1 Dashboard API description
 * OpenAPI spec version: 1.0
 */
import {
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  RaceDto
} from '../f1DashboardAPI.schemas';

import customInstance from '.././customAxios';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * @summary Get all races for a specific season
 */
export const racesControllerFindBySeason = (
    season: number,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<RaceDto[]>(
      {url: `/races/season/${season}`, method: 'GET', signal
    },
      options);
    }
  

export const getRacesControllerFindBySeasonQueryKey = (season: number,) => {
    return [`/races/season/${season}`] as const;
    }

    
export const getRacesControllerFindBySeasonQueryOptions = <TData = Awaited<ReturnType<typeof racesControllerFindBySeason>>, TError = unknown>(season: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof racesControllerFindBySeason>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getRacesControllerFindBySeasonQueryKey(season);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof racesControllerFindBySeason>>> = ({ signal }) => racesControllerFindBySeason(season, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(season), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof racesControllerFindBySeason>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type RacesControllerFindBySeasonQueryResult = NonNullable<Awaited<ReturnType<typeof racesControllerFindBySeason>>>
export type RacesControllerFindBySeasonQueryError = unknown


export function useRacesControllerFindBySeason<TData = Awaited<ReturnType<typeof racesControllerFindBySeason>>, TError = unknown>(
 season: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof racesControllerFindBySeason>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof racesControllerFindBySeason>>,
          TError,
          Awaited<ReturnType<typeof racesControllerFindBySeason>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRacesControllerFindBySeason<TData = Awaited<ReturnType<typeof racesControllerFindBySeason>>, TError = unknown>(
 season: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof racesControllerFindBySeason>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof racesControllerFindBySeason>>,
          TError,
          Awaited<ReturnType<typeof racesControllerFindBySeason>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRacesControllerFindBySeason<TData = Awaited<ReturnType<typeof racesControllerFindBySeason>>, TError = unknown>(
 season: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof racesControllerFindBySeason>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all races for a specific season
 */

export function useRacesControllerFindBySeason<TData = Awaited<ReturnType<typeof racesControllerFindBySeason>>, TError = unknown>(
 season: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof racesControllerFindBySeason>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getRacesControllerFindBySeasonQueryOptions(season,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



