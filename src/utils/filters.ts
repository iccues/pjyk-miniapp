import { SEASON_NAME_MAP } from "@/constants/ui-options";
import type { Season, SortBy } from "@/graphql/generated/graphql";

/**
 * 列表的筛选条件；没有年份时季度不生效
 */
export interface AnimeListFilters {
  year?: number;
  season?: Season;
  sortBy: SortBy;
}

export const DEFAULT_FILTERS: AnimeListFilters = { sortBy: "SCORE" };

/**
 * 合并筛选变化；清空年份时同时清空季度，与前台行为一致
 */
export const applyFilterChanges = (
  filters: AnimeListFilters,
  changes: Partial<AnimeListFilters>,
): AnimeListFilters => {
  const next = { ...filters, ...changes };
  if (next.year == null) next.season = undefined;
  return next;
};

/**
 * 列表标题，例如"2026年10月动画"、"2026年动画"、"全部动画"
 */
export const describeFilters = ({ year, season }: AnimeListFilters): string => {
  if (!year) return "全部动画";
  return season ? `${year}年${SEASON_NAME_MAP[season]}动画` : `${year}年动画`;
};
