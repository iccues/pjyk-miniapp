import { PAGE_SIZE } from "@/constants/ui-options";
import { GetAnimeListDocument, type GetAnimeListQueryVariables } from "@/graphql/generated/graphql";
import { request } from "@/graphql/request";

import { usePagedAnimeList } from "./usePagedAnimeList";

type ListFilters = Omit<GetAnimeListQueryVariables, "pageNumber" | "pageSize">;

/**
 * 按年份、季度和排序分页加载动画列表；筛选条件变化后由页面调用 reset
 */
export function useAnimeListQuery(filters: () => ListFilters) {
  return usePagedAnimeList(async (pageNumber) => {
    const data = await request(GetAnimeListDocument, {
      ...filters(),
      pageNumber,
      pageSize: PAGE_SIZE,
    });
    return data.animeList;
  });
}
