import type { ListLayout } from "@/constants/ui-options";

import type { AnimeListFilters } from "./filters";

export type DocName = "about" | "metric" | "platforms";

export const TAB_PAGES = {
  home: "/pages/index/index",
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

interface BrowseParams {
  filters?: Partial<AnimeListFilters>;
  layout?: ListLayout;
}

// 筛选条件转成页面参数，省略默认的"按评分"
const browseQuery = ({ filters = {}, layout }: BrowseParams) => ({
  year: filters.year,
  season: filters.year ? filters.season : undefined,
  sortBy: filters.sortBy === "POPULARITY" ? filters.sortBy : undefined,
  layout,
});

/**
 * 各页面的地址，参数统一在这里编码
 *
 * 标签页之间只能用 switchTab 切换，而且不能带参数；带参数的标签页地址只用于分享。
 */
export const routes = {
  home: () => TAB_PAGES.home,
  ranking: (params: BrowseParams = {}) => withQuery(TAB_PAGES.ranking, browseQuery(params)),
  search: ({ keyword, layout }: { keyword?: string; layout?: ListLayout } = {}) =>
    withQuery(TAB_PAGES.search, { q: keyword, layout }),
  anime: (animeId: number | string) => withQuery("/pages/anime/index", { animeId }),
  list: (params: BrowseParams = {}) => withQuery("/pages/list/index", browseQuery(params)),
  article: (name: DocName) => withQuery("/pages/article/index", { name }),
};
