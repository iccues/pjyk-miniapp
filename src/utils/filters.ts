import { SEASON_NAME_MAP } from "@/constants/ui-options";
import type { GetAnimeListQueryVariables, Season, SortBy } from "@/graphql/generated/graphql";

/**
 * 列表页的筛选条件，页码由分页逻辑单独维护
 */
export type AnimeListFilters = Pick<GetAnimeListQueryVariables, "year" | "season" | "sortBy">;

/**
 * 页面 onLoad 收到的参数，值可能经过 encodeURIComponent
 */
export type PageQuery = Record<string, string | undefined>;

const SEASONS: Season[] = ["WINTER", "SPRING", "SUMMER", "FALL"];
const SORT_BYS: SortBy[] = ["SCORE", "POPULARITY"];

export const decodeQueryValue = (value: string | undefined): string => {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/**
 * 根据月份确定季度
 */
export const getSeasonOfMonth = (month: number): Season => {
  if (month <= 3) return "WINTER";
  if (month <= 6) return "SPRING";
  if (month <= 9) return "SUMMER";
  return "FALL";
};

/**
 * 把页面参数转换为筛选条件，非法值按"不限定"处理，排序默认按评分
 */
export const queryToFilters = (query: PageQuery): AnimeListFilters => {
  const year = parseInt(query.year ?? "", 10);
  const season = query.season as Season;
  const sortBy = query.sortBy as SortBy;

  return {
    year: isNaN(year) ? undefined : year,
    season: SEASONS.includes(season) ? season : undefined,
    sortBy: SORT_BYS.includes(sortBy) ? sortBy : "SCORE",
  };
};

/**
 * 把筛选条件转换为页面参数，省略默认值
 */
export const filtersToQuery = (filters: AnimeListFilters): Record<string, string> => {
  const query: Record<string, string> = {};

  if (filters.year != null) query.year = filters.year.toString();
  if (filters.season != null) query.season = filters.season;
  if (filters.sortBy != null && filters.sortBy !== "SCORE") query.sortBy = filters.sortBy;

  return query;
};

/**
 * 合并筛选变化；清空年份时同时清空季度，与前台行为一致
 */
export const applyFilterChanges = (
  filters: AnimeListFilters,
  changes: Partial<AnimeListFilters>,
): AnimeListFilters => {
  const next = { ...filters, ...changes };
  if ("year" in changes && changes.year == null) next.season = undefined;
  return next;
};

/**
 * 列表标题，例如"2026年10月动画"、"全部动画 · 按人气"
 */
export const describeFilters = (filters: AnimeListFilters): string => {
  let title = "全部动画";

  if (filters.year) {
    const season = filters.season ? SEASON_NAME_MAP[filters.season] : "";
    title = `${filters.year}年${season}动画`;
  }

  return filters.sortBy === "POPULARITY" ? `${title} · 按人气` : title;
};
