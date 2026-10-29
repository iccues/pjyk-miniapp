import type { ListLayout } from "@/constants/ui-options";
import type { SortBy } from "@/graphql/generated/graphql";

import type { SeasonKey } from "./season";

export type DocName = "about" | "metric" | "platforms";

/**
 * 榜单范围：yearly 为年度榜，all 为历史榜
 */
export type RankingScope = "yearly" | "all";

export const TAB_PAGES = {
  season: "/pages/season/index",
  ranking: "/pages/ranking/index",
  search: "/pages/search/index",
} as const;

const withQuery = (path: string, query: Record<string, string | number | undefined>): string => {
  const search = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");

  return search ? `${path}?${search}` : path;
};

interface ListParams {
  sortBy?: SortBy;
  layout?: ListLayout;
}

/**
 * 各页面的地址，参数统一在这里编码
 *
 * 标签页之间只能用 switchTab 切换，而且不能带参数；带参数的标签页地址只用于分享。
 */
export const routes = {
  season: ({ key, sortBy, layout }: ListParams & { key?: SeasonKey } = {}) =>
    withQuery(TAB_PAGES.season, { year: key?.year, season: key?.season, sortBy, layout }),
  ranking: ({
    scope,
    year,
    sortBy,
    layout,
  }: ListParams & { scope?: RankingScope; year?: number }) =>
    withQuery(TAB_PAGES.ranking, { scope, year, sortBy, layout }),
  search: ({ keyword, layout }: { keyword?: string; layout?: ListLayout } = {}) =>
    withQuery(TAB_PAGES.search, { q: keyword, layout }),
  anime: (animeId: number | string) => withQuery("/pages/anime/index", { animeId }),
  list: ({ key, sortBy, layout }: ListParams & { key: SeasonKey }) =>
    withQuery("/pages/list/index", { year: key.year, season: key.season, sortBy, layout }),
  article: (name: DocName) => withQuery("/pages/article/index", { name }),
};
