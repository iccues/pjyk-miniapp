/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Platform =
  | 'AniList'
  | 'Bangumi'
  | 'MyAnimeList';

export type Season =
  | 'FALL'
  | 'SPRING'
  | 'SUMMER'
  | 'WINTER';

export type SortBy =
  | 'POPULARITY'
  | 'SCORE';

export type GetAnimeListQueryVariables = Exact<{
  year?: number | null | undefined;
  season?: Season | null | undefined;
  pageNumber?: number | null | undefined;
  pageSize?: number | null | undefined;
  sortBy?: SortBy | null | undefined;
}>;


export type GetAnimeListQuery = { animeList: { content: Array<{ animeId: number, coverImage: string | null, averageScore: number | null, popularity: number | null, startDate: string | null, title: { titleNative: string | null, titleCn: string | null } }>, pageInfo: { size: number, number: number, totalElements: number, totalPages: number } } };

export type GetAnimeListBySearchQueryVariables = Exact<{
  keyword?: string | null | undefined;
  pageNumber?: number | null | undefined;
  pageSize?: number | null | undefined;
}>;


export type GetAnimeListBySearchQuery = { animeListBySearch: { content: Array<{ animeId: number, coverImage: string | null, averageScore: number | null, popularity: number | null, startDate: string | null, title: { titleNative: string | null, titleCn: string | null } }>, pageInfo: { size: number, number: number, totalElements: number, totalPages: number } } };

export type AnimeListFragment = { content: Array<{ animeId: number, coverImage: string | null, averageScore: number | null, popularity: number | null, startDate: string | null, title: { titleNative: string | null, titleCn: string | null } }>, pageInfo: { size: number, number: number, totalElements: number, totalPages: number } };

export type AnimeCardFragment = { animeId: number, coverImage: string | null, averageScore: number | null, popularity: number | null, startDate: string | null, title: { titleNative: string | null, titleCn: string | null } };

export type GetAnimeDetailQueryVariables = Exact<{
  animeId: number;
}>;


export type GetAnimeDetailQuery = { anime: { animeId: number, coverImage: string | null, startDate: string | null, averageScore: number | null, popularity: number | null, title: { titleNative: string | null, titleRomaji: string | null, titleEn: string | null, titleCn: string | null }, mappings: Array<{ mappingId: number, sourcePlatform: Platform, platformId: string, rawScore: number | null, normalizedScore: number | null, rawPopularity: number | null, normalizedPopularity: number | null }> } | null };

export type MappingItemFragment = { sourcePlatform: Platform, platformId: string, rawScore: number | null, normalizedScore: number | null, rawPopularity: number | null, normalizedPopularity: number | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const AnimeCardFragmentDoc = new TypedDocumentString(`
    fragment AnimeCard on Anime {
  animeId
  title {
    titleNative
    titleCn
  }
  coverImage
  averageScore
  popularity
  startDate
}
    `, {"fragmentName":"AnimeCard"}) as unknown as TypedDocumentString<AnimeCardFragment, unknown>;
export const AnimeListFragmentDoc = new TypedDocumentString(`
    fragment AnimeList on AnimePage {
  content {
    animeId
    ...AnimeCard
  }
  pageInfo {
    size
    number
    totalElements
    totalPages
  }
}
    fragment AnimeCard on Anime {
  animeId
  title {
    titleNative
    titleCn
  }
  coverImage
  averageScore
  popularity
  startDate
}`, {"fragmentName":"AnimeList"}) as unknown as TypedDocumentString<AnimeListFragment, unknown>;
export const MappingItemFragmentDoc = new TypedDocumentString(`
    fragment MappingItem on Mapping {
  sourcePlatform
  platformId
  rawScore
  normalizedScore
  rawPopularity
  normalizedPopularity
}
    `, {"fragmentName":"MappingItem"}) as unknown as TypedDocumentString<MappingItemFragment, unknown>;
export const GetAnimeListDocument = new TypedDocumentString(`
    query GetAnimeList($year: Int, $season: Season, $pageNumber: Int, $pageSize: Int, $sortBy: SortBy) {
  animeList(
    year: $year
    season: $season
    pageNumber: $pageNumber
    pageSize: $pageSize
    sortBy: $sortBy
  ) {
    ...AnimeList
  }
}
    fragment AnimeList on AnimePage {
  content {
    animeId
    ...AnimeCard
  }
  pageInfo {
    size
    number
    totalElements
    totalPages
  }
}
fragment AnimeCard on Anime {
  animeId
  title {
    titleNative
    titleCn
  }
  coverImage
  averageScore
  popularity
  startDate
}`) as unknown as TypedDocumentString<GetAnimeListQuery, GetAnimeListQueryVariables>;
export const GetAnimeListBySearchDocument = new TypedDocumentString(`
    query GetAnimeListBySearch($keyword: String, $pageNumber: Int, $pageSize: Int) {
  animeListBySearch(
    keyword: $keyword
    pageNumber: $pageNumber
    pageSize: $pageSize
  ) {
    ...AnimeList
  }
}
    fragment AnimeList on AnimePage {
  content {
    animeId
    ...AnimeCard
  }
  pageInfo {
    size
    number
    totalElements
    totalPages
  }
}
fragment AnimeCard on Anime {
  animeId
  title {
    titleNative
    titleCn
  }
  coverImage
  averageScore
  popularity
  startDate
}`) as unknown as TypedDocumentString<GetAnimeListBySearchQuery, GetAnimeListBySearchQueryVariables>;
export const GetAnimeDetailDocument = new TypedDocumentString(`
    query GetAnimeDetail($animeId: ID!) {
  anime(animeId: $animeId) {
    animeId
    coverImage
    startDate
    averageScore
    popularity
    title {
      titleNative
      titleRomaji
      titleEn
      titleCn
    }
    mappings {
      mappingId
      ...MappingItem
    }
  }
}
    fragment MappingItem on Mapping {
  sourcePlatform
  platformId
  rawScore
  normalizedScore
  rawPopularity
  normalizedPopularity
}`) as unknown as TypedDocumentString<GetAnimeDetailQuery, GetAnimeDetailQueryVariables>;