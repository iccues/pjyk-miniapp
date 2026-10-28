<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { ref } from "vue";

import AnimeFilter from "@/components/AnimeFilter.vue";
import AnimeGrid from "@/components/AnimeGrid.vue";
import { usePagedAnimeList } from "@/composables/usePagedAnimeList";
import { PAGE_SIZE } from "@/constants/ui-options";
import { GetAnimeListDocument } from "@/graphql/generated/graphql";
import { request } from "@/graphql/request";
import {
  applyFilterChanges,
  describeFilters,
  queryToFilters,
  type AnimeListFilters,
  type PageQuery,
} from "@/utils/filters";
import { routes } from "@/utils/routes";

const filters = ref<AnimeListFilters>({ sortBy: "SCORE" });

const { items, total, loading, finished, error, reset, refresh, loadMore, retry } =
  usePagedAnimeList(async (pageNumber) => {
    const data = await request(GetAnimeListDocument, {
      ...filters.value,
      pageNumber,
      pageSize: PAGE_SIZE,
    });
    return data.animeList;
  });

const applyFilters = (next: AnimeListFilters) => {
  filters.value = next;
  uni.setNavigationBarTitle({ title: describeFilters(next) });
  reset();
};

const changeFilters = (changes: Partial<AnimeListFilters>) => {
  applyFilters(applyFilterChanges(filters.value, changes));
  uni.pageScrollTo({ scrollTop: 0, duration: 0 });
};

onLoad((query) => {
  applyFilters(queryToFilters((query ?? {}) as PageQuery));
});

onReachBottom(() => {
  loadMore();
});

onPullDownRefresh(async () => {
  await refresh();
  uni.stopPullDownRefresh();
});

onShareAppMessage(() => ({
  title: `${describeFilters(filters.value)} - 有希计划`,
  path: routes.animeList(filters.value),
}));
</script>

<template>
  <view class="page">
    <AnimeFilter :filters="filters" @change="changeFilters" />

    <view class="list">
      <AnimeGrid
        :items="items"
        :total="total"
        :loading="loading"
        :finished="finished"
        :error="error"
        @retry="retry"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px $page-gutter 0;
}

.list {
  margin-top: 24px;
}
</style>
