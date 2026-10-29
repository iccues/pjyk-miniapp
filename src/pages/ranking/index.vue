<script setup lang="ts">
import { onLoad, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { ref } from "vue";

import AnimeBrowser from "@/components/AnimeBrowser.vue";
import type { ListLayout } from "@/constants/ui-options";
import { DEFAULT_FILTERS, describeFilters, type AnimeListFilters } from "@/utils/filters";
import { parseFilters, parseLayout, toPageQuery } from "@/utils/query";
import { routes } from "@/utils/routes";

// 榜单标签页：只负责页面级的事（分享、触底），筛选和列表都在 AnimeBrowser 里，与"查看全部"的列表页共用
const browser = ref<InstanceType<typeof AnimeBrowser>>();
const initial = ref<{ filters: AnimeListFilters; layout: ListLayout }>();
const state = ref({ filters: DEFAULT_FILTERS, layout: "row" as ListLayout });

const onChange = (filters: AnimeListFilters, layout: ListLayout) => {
  state.value = { filters, layout };
};

// 默认是全部年份按评分排列，即历史榜；分享链接会带上分享者当时的筛选和样式
onLoad((options) => {
  const query = toPageQuery(options);
  state.value = {
    filters: parseFilters(query, DEFAULT_FILTERS),
    layout: parseLayout(query.layout) ?? "row",
  };
  initial.value = state.value;
});

onReachBottom(() => {
  browser.value?.loadMore();
});

onShareAppMessage(() => ({
  title: `${describeFilters(state.value.filters)}榜单 - 有希计划`,
  path: routes.ranking(state.value),
}));
</script>

<template>
  <AnimeBrowser
    v-if="initial"
    ref="browser"
    :initial-filters="initial.filters"
    :initial-layout="initial.layout"
    @change="onChange"
  />
</template>
