import { ref, shallowRef } from "vue";

import { errorMessage } from "@/graphql/request";

/**
 * 单次请求的状态管理
 *
 * 重新请求时保留旧数据，便于下拉刷新时不闪骨架屏；只采用最后一次请求的结果。
 */
export function useRequest<T>(fetcher: () => Promise<T>) {
  const data = shallowRef<T>();
  const loading = ref(false);
  const error = ref<string>();
  let generation = 0;

  const run = async () => {
    const current = ++generation;
    loading.value = true;
    error.value = undefined;

    try {
      const result = await fetcher();
      if (current === generation) data.value = result;
    } catch (e) {
      if (current === generation) error.value = errorMessage(e);
    } finally {
      if (current === generation) loading.value = false;
    }
  };

  return { data, loading, error, run };
}
