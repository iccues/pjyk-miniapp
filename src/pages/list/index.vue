<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { ref } from "vue";

import AnimeList from "@/components/AnimeList.vue";
import HomeFab from "@/components/HomeFab.vue";
import ListToolbar from "@/components/ListToolbar.vue";
import { useAnimeListQuery } from "@/composables/useAnimeListQuery";
import type { ListLayout } from "@/constants/ui-options";
import type { SortBy } from "@/graphql/generated/graphql";
import { hideNativeHomeButton, isEntryPage } from "@/utils/navigation";
import { parseLayout, parseSeasonKey, parseSortBy, toPageQuery } from "@/utils/query";
import { routes } from "@/utils/routes";
import { formatSeason, getCurrentSeason, type SeasonKey } from "@/utils/season";

// 某个季度的完整列表，从详情页"查看全部"和搜索页的季度入口进入
const season = ref<SeasonKey>(getCurrentSeason());
const sortBy = ref<SortBy>("SCORE");
const layout = ref<ListLayout>("grid");
const showHome = ref(false);

const { items, total, loading, finished, error, reset, refresh, loadMore, retry } =
  useAnimeListQuery(() => ({
    year: season.value.year,
    season: season.value.season,
    sortBy: sortBy.value,
  }));

const scrollToTop = () => uni.pageScrollTo({ scrollTop: 0, duration: 0 });

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

onLoad((options) => {
  const query = toPageQuery(options);
  season.value = parseSeasonKey(query) ?? season.value;
  sortBy.value = parseSortBy(query.sortBy) ?? sortBy.value;
  layout.value = parseLayout(query.layout) ?? layout.value;
  uni.setNavigationBarTitle({ title: `${formatSeason(season.value)}动画` });

  showHome.value = isEntryPage();
  if (showHome.value) hideNativeHomeButton();

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
  title: `${formatSeason(season.value)}动画 - 有希计划`,
  path: routes.list({ key: season.value, sortBy: sortBy.value, layout: layout.value }),
}));
</script>

<template>
  <view class="header">
    <ListToolbar
      :sort-by="sortBy"
      :layout="layout"
      @update:sort-by="changeSortBy"
      @update:layout="changeLayout"
    />
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

  <HomeFab v-if="showHome" />
</template>

<style lang="scss" scoped>
/* H5 下页面顶部有模拟导航栏，--window-top 是它的高度；小程序里该变量不存在，回退为 0 */
.header {
  position: sticky;
  top: var(--window-top, 0px);
  z-index: 10;
  padding: 0 $page-gutter;
  border-bottom: 1px solid $gray-100;
  background-color: #fff;
}

.content {
  padding: 8px $page-gutter 0;
}
</style>
