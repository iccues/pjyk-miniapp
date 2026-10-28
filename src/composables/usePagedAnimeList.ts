import { ref, shallowRef } from "vue";

import type { AnimeListFragment } from "@/graphql/generated/graphql";
import { errorMessage } from "@/graphql/request";

export type AnimeListItem = AnimeListFragment["content"][number];

/**
 * 触底加载的动画列表，fetchPage 接收从 0 开始的页码
 *
 * 筛选条件变化时调用 reset，旧的请求结果会被丢弃；下拉刷新调用 refresh，新数据返回前保留旧列表。
 */
export function usePagedAnimeList(fetchPage: (pageNumber: number) => Promise<AnimeListFragment>) {
  const items = shallowRef<AnimeListItem[]>([]);
  const total = ref(0);
  // 页面在 onLoad 里才发起首次请求，初始即视为加载中，避免先闪一下"暂无数据"
  const loading = ref(true);
  const error = ref<string>();
  const finished = ref(false);
  let nextPage = 0;
  let generation = 0;

  const load = async (pageNumber: number) => {
    const current = generation;
    loading.value = true;
    error.value = undefined;

    try {
      const page = await fetchPage(pageNumber);
      if (current !== generation) return;

      // 翻页期间排序可能变化，按 animeId 去重，避免同一部动画出现两次
      const existing = pageNumber === 0 ? [] : items.value;
      const seen = new Set(existing.map((anime) => anime.animeId));
      items.value = [...existing, ...page.content.filter((anime) => !seen.has(anime.animeId))];

      total.value = page.pageInfo.totalElements;
      nextPage = page.pageInfo.number + 1;
      finished.value = nextPage >= page.pageInfo.totalPages;
    } catch (e) {
      if (current === generation) error.value = errorMessage(e);
    } finally {
      if (current === generation) loading.value = false;
    }
  };

  // 作废进行中的请求并清空列表
  const clear = () => {
    generation++;
    items.value = [];
    total.value = 0;
    loading.value = false;
    error.value = undefined;
    finished.value = false;
    nextPage = 0;
  };

  const reset = () => {
    clear();
    return load(0);
  };

  const refresh = () => {
    generation++;
    return load(0);
  };

  const loadMore = async () => {
    if (loading.value || finished.value || error.value) return;
    await load(nextPage);
  };

  const retry = () => load(nextPage);

  return { items, total, loading, error, finished, clear, reset, refresh, loadMore, retry };
}
