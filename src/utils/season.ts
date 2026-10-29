import { SEASON_NAME_MAP } from "@/constants/ui-options";
import type { Season } from "@/graphql/generated/graphql";

export interface SeasonKey {
  year: number;
  season: Season;
}

const SEASONS_IN_ORDER: Season[] = ["WINTER", "SPRING", "SUMMER", "FALL"];

/**
 * 数据最早的年份，与前台年份筛选的起点一致
 */
export const EARLIEST_YEAR = 1990;

/**
 * 按自然月份确定季度
 */
export const getSeasonOfMonth = (month: number): Season =>
  SEASONS_IN_ORDER[Math.floor((month - 1) / 3)]!;

/**
 * 当前所在的季度，与前台首页的"本季"一致
 */
export const getCurrentSeason = (date = new Date()): SeasonKey => ({
  year: date.getFullYear(),
  season: getSeasonOfMonth(date.getMonth() + 1),
});

/**
 * 年度榜默认年份：1 月季度刚开始时当年数据太少，展示上一年
 */
export const getDefaultRankingYear = (date = new Date()): number => {
  const { year, season } = getCurrentSeason(date);
  return season === "WINTER" ? year - 1 : year;
};

/**
 * 季度名称，例如"2026年10月"
 */
export const formatSeason = ({ year, season }: SeasonKey): string =>
  `${year}年${SEASON_NAME_MAP[season]}`;

/**
 * 根据开播日期推算后端归类的季度
 *
 * 后端把每个季度整体前移一个月（10 月季度覆盖 9 月 1 日到 11 月 30 日），以容纳提前开播的作品，
 * 所以这里把月份加一后再按自然季度计算。
 */
export const getSeasonOfStartDate = (
  startDate: string | null | undefined,
): SeasonKey | undefined => {
  const match = /^(\d{4})-(\d{2})/.exec(startDate ?? "");
  if (!match) return undefined;

  let year = Number(match[1]);
  let month = Number(match[2]) + 1;
  if (month > 12) {
    year += 1;
    month = 1;
  }
  return { year, season: getSeasonOfMonth(month) };
};
