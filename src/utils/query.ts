import type { ListLayout } from "@/constants/ui-options";
import type { Season, SortBy } from "@/graphql/generated/graphql";

import { EARLIEST_YEAR, type SeasonKey } from "./season";

/**
 * 页面 onLoad 收到的参数，值可能经过 encodeURIComponent
 *
 * 分享卡片、视频挂载都会带参数直接打开页面，解析时对非法值一律回退到默认值。
 */
export type PageQuery = Record<string, string | undefined>;

const SEASONS: Season[] = ["WINTER", "SPRING", "SUMMER", "FALL"];
const SORT_BYS: SortBy[] = ["SCORE", "POPULARITY"];
const LAYOUTS: ListLayout[] = ["grid", "row"];

export const toPageQuery = (query: unknown): PageQuery => (query ?? {}) as PageQuery;

export const decodeQueryValue = (value: string | undefined): string => {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const parseYear = (value: string | undefined): number | undefined => {
  const year = parseInt(value ?? "", 10);
  return year >= EARLIEST_YEAR && year <= new Date().getFullYear() + 1 ? year : undefined;
};

export const parseSeasonKey = (query: PageQuery): SeasonKey | undefined => {
  const year = parseYear(query.year);
  const season = query.season as Season;
  return year !== undefined && SEASONS.includes(season) ? { year, season } : undefined;
};

export const parseSortBy = (value: string | undefined): SortBy | undefined =>
  SORT_BYS.includes(value as SortBy) ? (value as SortBy) : undefined;

export const parseLayout = (value: string | undefined): ListLayout | undefined =>
  LAYOUTS.includes(value as ListLayout) ? (value as ListLayout) : undefined;
