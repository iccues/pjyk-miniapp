/**
 * UI 选项常量
 *
 * 与 pjyk 仓库 web/apps/client 的同名文件保持一致：筛选器用到的选项，以及标题、文案用到的名称映射。
 */

import type { Season, SortBy } from "@/graphql/generated/graphql";

/**
 * 选项的通用形状：label 用于展示，value 用于取值
 *
 * value 为 undefined 表示"全部"这类不限定的选项
 */
export type SelectOption<T> = { label: string; value: T };

/**
 * 季度选项（含"全部"选项，用于筛选器）
 */
export const SEASON_OPTIONS: SelectOption<Season | undefined>[] = [
  { label: "全部", value: undefined },
  { label: "1月", value: "WINTER" },
  { label: "4月", value: "SPRING" },
  { label: "7月", value: "SUMMER" },
  { label: "10月", value: "FALL" },
];

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
 * 生成年份选项（从当前年份倒序到指定年份）
 * @param startYear 开始的年份
 * @returns 年份选项数组，包含"全部"选项和年份选项
 */
export function generateYearOptionsFrom(startYear: number): SelectOption<number | undefined>[] {
  const currentYear = new Date().getFullYear();
  const years: SelectOption<number | undefined>[] = [{ label: "全部", value: undefined }];

  for (let year = currentYear; year >= startYear; year--) {
    years.push({ label: `${year}年`, value: year });
  }

  return years;
}

/**
 * 列表每页条数，与前台保持一致
 */
export const PAGE_SIZE = 30;
