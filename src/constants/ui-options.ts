/**
 * UI 选项常量
 *
 * 选项和名称映射取自 pjyk 仓库 web/apps/client 的同名文件，按小程序的页面需要做了裁剪。
 */

import type { Season, SortBy } from "@/graphql/generated/graphql";

/**
 * 选项的通用形状：label 用于展示，value 用于取值
 */
export type SelectOption<T> = { label: string; value: T };

/**
 * 排序选项
 */
export const SORT_BY_OPTIONS: SelectOption<SortBy>[] = [
  { label: "按评分", value: "SCORE" },
  { label: "按人气", value: "POPULARITY" },
];

/**
 * 季度名称映射
 */
export const SEASON_NAME_MAP: Record<Season, string> = {
  WINTER: "1月",
  SPRING: "4月",
  SUMMER: "7月",
  FALL: "10月",
};

/**
 * 年份选项，从当前年份倒序到 startYear
 */
export function generateYearOptionsFrom(startYear: number): SelectOption<number>[] {
  const years: SelectOption<number>[] = [];

  for (let year = new Date().getFullYear(); year >= startYear; year--) {
    years.push({ label: `${year}年`, value: year });
  }

  return years;
}

/**
 * 列表每页条数，与前台保持一致
 */
export const PAGE_SIZE = 30;

/**
 * 列表样式：grid 为三列海报宫格，row 为带详细信息的横向行
 */
export type ListLayout = "grid" | "row";
