/**
 * 首页搜索框提交的关键词，切到搜索标签后由搜索页取走
 *
 * switchTab 不能带参数，只能借内存中转；只在本次运行中有效，不存到本机。
 */
let pendingKeyword: string | undefined;

export const setPendingSearch = (keyword: string) => {
  pendingKeyword = keyword;
};

export const takePendingSearch = (): string | undefined => {
  const keyword = pendingKeyword;
  pendingKeyword = undefined;
  return keyword;
};
