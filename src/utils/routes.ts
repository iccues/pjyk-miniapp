import { filtersToQuery, type AnimeListFilters } from "./filters";

export type DocName = "about" | "metric" | "platforms";

const withQuery = (path: string, query: Record<string, string | number | undefined>): string => {
  const search = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");

  return search ? `${path}?${search}` : path;
};

/**
 * 各页面的跳转地址，参数统一在这里编码
 */
export const routes = {
  home: () => "/pages/index/index",
  animeList: (filters: AnimeListFilters = {}) =>
    withQuery("/pages/anime-list/index", filtersToQuery(filters)),
  search: (keyword?: string) => withQuery("/pages/search/index", { q: keyword }),
  animeDetail: (animeId: number | string) => withQuery("/pages/anime-detail/index", { animeId }),
  docs: (name: DocName) => withQuery("/pages/docs/index", { name }),
};
