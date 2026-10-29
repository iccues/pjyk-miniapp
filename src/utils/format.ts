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
 * 紧凑的数量，用于空间有限的列表行，例如 1205855 → "120.6万"
 */
export const formatCompact = (value: number): string => {
  if (value < 10000) return formatInteger(value);
  return `${(value / 10000).toFixed(1).replace(/\.0$/, "")}万`;
};

/**
 * 开播年月，例如 "2008-10-02" → "2008年10月"
 */
export const formatStartMonth = (startDate: string): string => {
  const [year, month] = startDate.split("-");
  return month ? `${year}年${Number(month)}月` : startDate;
};

/**
 * 动画展示标题：优先中文名，其次原名
 */
export const getDisplayTitle = (title: {
  titleCn?: string | null;
  titleNative?: string | null;
  titleRomaji?: string | null;
  titleEn?: string | null;
}): string => title.titleCn || title.titleNative || title.titleRomaji || title.titleEn || "";
