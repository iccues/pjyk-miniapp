/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query GetAnimeList($year: Int, $season: Season, $pageNumber: Int, $pageSize: Int, $sortBy: SortBy) {\n  animeList(\n    year: $year\n    season: $season\n    pageNumber: $pageNumber\n    pageSize: $pageSize\n    sortBy: $sortBy\n  ) {\n    ...AnimeList\n  }\n}\n\nquery GetAnimeListBySearch($keyword: String, $pageNumber: Int, $pageSize: Int) {\n  animeListBySearch(\n    keyword: $keyword\n    pageNumber: $pageNumber\n    pageSize: $pageSize\n  ) {\n    ...AnimeList\n  }\n}\n\nfragment AnimeList on AnimePage {\n  content {\n    animeId\n    ...AnimeCard\n  }\n  pageInfo {\n    size\n    number\n    totalElements\n    totalPages\n  }\n}\n\nfragment AnimeCard on Anime {\n  animeId\n  title {\n    titleNative\n    titleCn\n  }\n  coverImage\n  averageScore\n  popularity\n  startDate\n}\n\nquery GetAnimeDetail($animeId: ID!) {\n  anime(animeId: $animeId) {\n    animeId\n    coverImage\n    startDate\n    averageScore\n    popularity\n    title {\n      titleNative\n      titleRomaji\n      titleEn\n      titleCn\n    }\n    mappings {\n      mappingId\n      ...MappingItem\n    }\n  }\n}\n\nfragment MappingItem on Mapping {\n  sourcePlatform\n  platformId\n  rawScore\n  normalizedScore\n  rawPopularity\n  normalizedPopularity\n}": typeof types.GetAnimeListDocument,
};
const documents: Documents = {
    "query GetAnimeList($year: Int, $season: Season, $pageNumber: Int, $pageSize: Int, $sortBy: SortBy) {\n  animeList(\n    year: $year\n    season: $season\n    pageNumber: $pageNumber\n    pageSize: $pageSize\n    sortBy: $sortBy\n  ) {\n    ...AnimeList\n  }\n}\n\nquery GetAnimeListBySearch($keyword: String, $pageNumber: Int, $pageSize: Int) {\n  animeListBySearch(\n    keyword: $keyword\n    pageNumber: $pageNumber\n    pageSize: $pageSize\n  ) {\n    ...AnimeList\n  }\n}\n\nfragment AnimeList on AnimePage {\n  content {\n    animeId\n    ...AnimeCard\n  }\n  pageInfo {\n    size\n    number\n    totalElements\n    totalPages\n  }\n}\n\nfragment AnimeCard on Anime {\n  animeId\n  title {\n    titleNative\n    titleCn\n  }\n  coverImage\n  averageScore\n  popularity\n  startDate\n}\n\nquery GetAnimeDetail($animeId: ID!) {\n  anime(animeId: $animeId) {\n    animeId\n    coverImage\n    startDate\n    averageScore\n    popularity\n    title {\n      titleNative\n      titleRomaji\n      titleEn\n      titleCn\n    }\n    mappings {\n      mappingId\n      ...MappingItem\n    }\n  }\n}\n\nfragment MappingItem on Mapping {\n  sourcePlatform\n  platformId\n  rawScore\n  normalizedScore\n  rawPopularity\n  normalizedPopularity\n}": types.GetAnimeListDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAnimeList($year: Int, $season: Season, $pageNumber: Int, $pageSize: Int, $sortBy: SortBy) {\n  animeList(\n    year: $year\n    season: $season\n    pageNumber: $pageNumber\n    pageSize: $pageSize\n    sortBy: $sortBy\n  ) {\n    ...AnimeList\n  }\n}\n\nquery GetAnimeListBySearch($keyword: String, $pageNumber: Int, $pageSize: Int) {\n  animeListBySearch(\n    keyword: $keyword\n    pageNumber: $pageNumber\n    pageSize: $pageSize\n  ) {\n    ...AnimeList\n  }\n}\n\nfragment AnimeList on AnimePage {\n  content {\n    animeId\n    ...AnimeCard\n  }\n  pageInfo {\n    size\n    number\n    totalElements\n    totalPages\n  }\n}\n\nfragment AnimeCard on Anime {\n  animeId\n  title {\n    titleNative\n    titleCn\n  }\n  coverImage\n  averageScore\n  popularity\n  startDate\n}\n\nquery GetAnimeDetail($animeId: ID!) {\n  anime(animeId: $animeId) {\n    animeId\n    coverImage\n    startDate\n    averageScore\n    popularity\n    title {\n      titleNative\n      titleRomaji\n      titleEn\n      titleCn\n    }\n    mappings {\n      mappingId\n      ...MappingItem\n    }\n  }\n}\n\nfragment MappingItem on Mapping {\n  sourcePlatform\n  platformId\n  rawScore\n  normalizedScore\n  rawPopularity\n  normalizedPopularity\n}"): typeof import('./graphql').GetAnimeListDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
