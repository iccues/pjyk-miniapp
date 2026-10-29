<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { ref } from "vue";

import AnimeList from "@/components/AnimeList.vue";
import ListToolbar from "@/components/ListToolbar.vue";
import SeasonTabs from "@/components/SeasonTabs.vue";
import { useAnimeListQuery } from "@/composables/useAnimeListQuery";
import type { ListLayout } from "@/constants/ui-options";
import type { SortBy } from "@/graphql/generated/graphql";
import { parseLayout, parseSeasonKey, parseSortBy, toPageQuery } from "@/utils/query";
import { routes } from "@/utils/routes";
import { formatSeason, getCurrentSeason, type SeasonKey } from "@/utils/season";

const season = ref<SeasonKey>(getCurrentSeason());
const sortBy = ref<SortBy>("SCORE");
const layout = ref<ListLayout>("grid");

const { items, total, loading, finished, error, reset, refresh, loadMore, retry } =
  useAnimeListQuery(() => ({
    year: season.value.year,
    season: season.value.season,
    sortBy: sortBy.value,
  }));

const scrollToTop = () => uni.pageScrollTo({ scrollTop: 0, duration: 0 });

const changeSeason = (key: SeasonKey) => {
  season.value = key;
  reset();
  scrollToTop();
};

const changeSortBy = (value: SortBy) => {
  sortBy.value = value;
  reset();
  scrollToTop();
};

// 切换样式不重新请求，已加载的数据直接换一种排法
const changeLayout = (value: ListLayout) => {
  layout.value = value;
  scrollToTop();
};

// 从分享卡片打开时恢复分享者看到的季度、排序和样式
onLoad((options) => {
  const query = toPageQuery(options);
  season.value = parseSeasonKey(query) ?? season.value;
  sortBy.value = parseSortBy(query.sortBy) ?? sortBy.value;
  layout.value = parseLayout(query.layout) ?? layout.value;
  reset();
});

onReachBottom(() => {
  loadMore();
});

onPullDownRefresh(async () => {
  await refresh();
  uni.stopPullDownRefresh();
});

onShareAppMessage(() => ({
  title: `${formatSeason(season.value)}新番 - 有希计划`,
  path: routes.season({ key: season.value, sortBy: sortBy.value, layout: layout.value }),
}));
</script>

<template>
  <view class="header">
    <SeasonTabs :model-value="season" @update:model-value="changeSeason" />
    <view class="toolbar">
      <ListToolbar
        :sort-by="sortBy"
        :layout="layout"
        @update:sort-by="changeSortBy"
        @update:layout="changeLayout"
      />
    </view>
  </view>

  <view class="content">
    <AnimeList
      :items="items"
      :layout="layout"
      :total="total"
      :loading="loading"
      :finished="finished"
      :error="error"
      show-rank
      empty-text="这个季度还没有动画"
      @retry="retry"
    />
  </view>
</template>

<style lang="scss" scoped>
/* 顶部结构与榜单页一致：标签行 + 筛选栏，高度由 uni.scss 里的变量统一 */
/* H5 下页面顶部有模拟导航栏，--window-top 是它的高度；小程序里该变量不存在，回退为 0 */
.header {
  position: sticky;
  top: var(--window-top, 0px);
  z-index: 10;
  border-bottom: 1px solid $gray-100;
  background-color: #fff;
}

.toolbar {
  padding: 0 $page-gutter;
}

.content {
  padding: 8px $page-gutter 0;
}
</style>
