/**
 * 千分位整数，例如 12345.6 → "12,346"
 *
 * 部分小程序的安卓运行环境不带 Intl，不能用 Intl.NumberFormat。
 */
export const formatInteger = (value: number): string =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/**
 * 动画展示标题：优先中文名，其次原名
 */
export const getDisplayTitle = (title: {
  titleCn?: string | null;
  titleNative?: string | null;
  titleRomaji?: string | null;
  titleEn?: string | null;
}): string => title.titleCn || title.titleNative || title.titleRomaji || title.titleEn || "";
