<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useAnimeListQuery } from "@/composables/useAnimeListQuery";
import type { ListLayout } from "@/constants/ui-options";
import type { AnimeListFilters } from "@/utils/filters";

import AnimeFilterBar from "./AnimeFilterBar.vue";
import AnimeList from "./AnimeList.vue";

/**
 * 可筛选的动画列表：顶部筛选栏 + 列表 + 分页加载
 *
 * 榜单标签页和"查看全部"打开的列表页都只是在外面套一层页面，内容完全由这里负责。
 * 触底加载需要页面在 onReachBottom 里调用 loadMore。
 */
const props = defineProps<{
  initialFilters: AnimeListFilters;
  initialLayout: ListLayout;
}>();

const emit = defineEmits<{ change: [filters: AnimeListFilters, layout: ListLayout] }>();

const filters = ref<AnimeListFilters>({ ...props.initialFilters });
const layout = ref<ListLayout>(props.initialLayout);

const { items, total, loading, finished, error, reset, loadMore, retry } = useAnimeListQuery(
  () => filters.value,
);

const scrollToTop = () => uni.pageScrollTo({ scrollTop: 0, duration: 0 });

const changeFilters = (next: AnimeListFilters) => {
  filters.value = next;
  reset();
  scrollToTop();
  emit("change", next, layout.value);
};

// 切换样式不重新请求，已加载的数据直接换一种排法
const changeLayout = (next: ListLayout) => {
  layout.value = next;
  scrollToTop();
  emit("change", filters.value, next);
};

onMounted(() => {
  reset();
});

defineExpose({ loadMore });
</script>

<template>
  <view class="browser">
    <!-- 筛选栏固定在顶部；用 fixed 而不是 sticky，组件节点的 display 在各平台不一致，sticky 不可靠 -->
    <view class="header">
      <AnimeFilterBar
        :filters="filters"
        :layout="layout"
        @update:filters="changeFilters"
        @update:layout="changeLayout"
      />
    </view>
    <view class="header-placeholder" />

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
  </view>
</template>

<style lang="scss" scoped>
/* H5 下页面顶部有模拟导航栏，--window-top 是它的高度；小程序里该变量不存在，回退为 0 */
.header {
  position: fixed;
  top: var(--window-top, 0px);
  right: 0;
  left: 0;
  z-index: 10;
  border-bottom: 1px solid $gray-100;
  background-color: #fff;
}

.header-placeholder {
  height: calc(#{$list-tabs-height} + #{$list-toolbar-height} + 1px);
}

.content {
  padding: 8px $page-gutter 0;
}
</style>
