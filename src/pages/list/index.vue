<script setup lang="ts">
import { onLoad, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { ref } from "vue";

import AnimeBrowser from "@/components/AnimeBrowser.vue";
import HomeFab from "@/components/HomeFab.vue";
import type { ListLayout } from "@/constants/ui-options";
import { DEFAULT_FILTERS, describeFilters, type AnimeListFilters } from "@/utils/filters";
import { hideNativeHomeButton, isEntryPage } from "@/utils/navigation";
import { parseFilters, parseLayout, toPageQuery } from "@/utils/query";
import { routes } from "@/utils/routes";

// 首页"查看全部"等入口打开的列表页：内容与榜单标签页完全相同（AnimeBrowser），只是这里是可返回的普通页面
const browser = ref<InstanceType<typeof AnimeBrowser>>();
const initial = ref<{ filters: AnimeListFilters; layout: ListLayout }>();
const state = ref({ filters: DEFAULT_FILTERS, layout: "grid" as ListLayout });
const showHome = ref(false);

const updateTitle = () => {
  uni.setNavigationBarTitle({ title: describeFilters(state.value.filters) });
};

const onChange = (filters: AnimeListFilters, layout: ListLayout) => {
  state.value = { filters, layout };
  updateTitle();
};

onLoad((options) => {
  const query = toPageQuery(options);
  state.value = {
    filters: parseFilters(query, DEFAULT_FILTERS),
    layout: parseLayout(query.layout) ?? "grid",
  };
  initial.value = state.value;
  updateTitle();

  showHome.value = isEntryPage();
  if (showHome.value) hideNativeHomeButton();
});

onReachBottom(() => {
  browser.value?.loadMore();
});

onShareAppMessage(() => ({
  title: `${describeFilters(state.value.filters)} - 有希计划`,
  path: routes.list(state.value),
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

  <HomeFab v-if="showHome" />
</template>
