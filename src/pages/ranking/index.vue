<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { ref } from "vue";

import AnimeList from "@/components/AnimeList.vue";
import ListToolbar from "@/components/ListToolbar.vue";
import TabItem from "@/components/TabItem.vue";
import YearPicker from "@/components/YearPicker.vue";
import { useAnimeListQuery } from "@/composables/useAnimeListQuery";
import type { ListLayout, SelectOption } from "@/constants/ui-options";
import type { SortBy } from "@/graphql/generated/graphql";
import { parseLayout, parseSortBy, parseYear, toPageQuery } from "@/utils/query";
import { routes, type RankingScope } from "@/utils/routes";
import { getDefaultRankingYear } from "@/utils/season";

const SCOPE_OPTIONS: SelectOption<RankingScope>[] = [
  { label: "年度榜", value: "yearly" },
  { label: "历史榜", value: "all" },
];

const scope = ref<RankingScope>("yearly");
const year = ref(getDefaultRankingYear());
const sortBy = ref<SortBy>("SCORE");
const layout = ref<ListLayout>("row");

const { items, total, loading, finished, error, reset, refresh, loadMore, retry } =
  useAnimeListQuery(() => ({
    year: scope.value === "yearly" ? year.value : undefined,
    sortBy: sortBy.value,
  }));

const scrollToTop = () => uni.pageScrollTo({ scrollTop: 0, duration: 0 });

const reload = () => {
  reset();
  scrollToTop();
};

const changeScope = (value: RankingScope) => {
  scope.value = value;
  reload();
};

const changeYear = (value: number) => {
  year.value = value;
  reload();
};

const changeSortBy = (value: SortBy) => {
  sortBy.value = value;
  reload();
};

// 切换样式不重新请求，已加载的数据直接换一种排法
const changeLayout = (value: ListLayout) => {
  layout.value = value;
  scrollToTop();
};

const shareTitle = () => (scope.value === "yearly" ? `${year.value}年度榜` : "历史榜");

onLoad((options) => {
  const query = toPageQuery(options);
  if (query.scope === "yearly" || query.scope === "all") scope.value = query.scope;
  year.value = parseYear(query.year) ?? year.value;
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
  title: `${shareTitle()} - 有希计划`,
  path: routes.ranking({
    scope: scope.value,
    year: year.value,
    sortBy: sortBy.value,
    layout: layout.value,
  }),
}));
</script>

<template>
  <view class="header">
    <view class="tabs">
      <view v-for="option in SCOPE_OPTIONS" :key="option.value" class="tab">
        <TabItem
          :label="option.label"
          :active="scope === option.value"
          @select="changeScope(option.value)"
        />
      </view>
      <view v-if="scope === 'yearly'" class="year">
        <YearPicker :model-value="year" @update:model-value="changeYear" />
      </view>
    </view>
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
      @retry="retry"
    />
  </view>
</template>

<style lang="scss" scoped>
/* 顶部结构与新番页一致：标签行 + 筛选栏，高度由 uni.scss 里的变量统一 */
/* H5 下页面顶部有模拟导航栏，--window-top 是它的高度；小程序里该变量不存在，回退为 0 */
.header {
  position: sticky;
  top: var(--window-top, 0px);
  z-index: 10;
  border-bottom: 1px solid $gray-100;
  background-color: #fff;
}

.tabs {
  display: flex;
  align-items: center;
  height: $list-tabs-height;
  padding: 0 $page-gutter;
}

.tab + .tab {
  margin-left: 20px;
}

.year {
  margin-left: auto;
}

.toolbar {
  padding: 0 $page-gutter;
}

.content {
  padding: 8px $page-gutter 0;
}
</style>
