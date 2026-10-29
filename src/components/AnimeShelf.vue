<script setup lang="ts">
import type { AnimeCardFragment } from "@/graphql/generated/graphql";

import AnimeCard from "./AnimeCard.vue";
import AnimeCardSkeleton from "./AnimeCardSkeleton.vue";

// 可横向滑动的一行海报，右上角"查看全部"进入完整列表；首页和详情页共用
withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    animeList?: AnimeCardFragment[];
    loading?: boolean;
  }>(),
  { loading: false },
);

const emit = defineEmits<{ more: [] }>();
</script>

<template>
  <view class="shelf">
    <view class="shelf__header">
      <text class="shelf__title">{{ title }}</text>
      <text v-if="subtitle" class="shelf__subtitle">{{ subtitle }}</text>
      <view class="shelf__more" hover-class="shelf__more--active" @tap="emit('more')">
        <text>查看全部</text>
        <view class="shelf__arrow" />
      </view>
    </view>

    <view v-if="!loading && !animeList?.length" class="shelf__empty">暂无数据</view>

    <scroll-view
      v-else
      class="shelf__scroll"
      :scroll-x="true"
      :show-scrollbar="false"
      :enhanced="true"
    >
      <view class="shelf__track">
        <template v-if="loading && !animeList?.length">
          <view v-for="index in 4" :key="index" class="shelf__item">
            <AnimeCardSkeleton />
          </view>
        </template>
        <template v-else>
          <view v-for="anime in animeList" :key="anime.animeId" class="shelf__item">
            <AnimeCard :anime="anime" />
          </view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
.shelf__header {
  display: flex;
  align-items: baseline;
  padding: 0 $page-gutter;
}

.shelf__title {
  color: $gray-900;
  font-size: 17px;
  font-weight: 700;
}

.shelf__subtitle {
  margin-left: 8px;
  color: $gray-400;
  font-size: 13px;
}

.shelf__more {
  display: flex;
  align-items: center;
  margin-left: auto;
  color: $gray-500;
  font-size: 13px;
}

.shelf__more--active {
  opacity: 0.6;
}

.shelf__arrow {
  width: 6px;
  height: 6px;
  margin-left: 4px;
  border-top: 1.5px solid currentColor;
  border-right: 1.5px solid currentColor;
  transform: rotate(45deg);
}

.shelf__scroll {
  width: 100%;
  white-space: nowrap;
}

/* inline-flex 让轨道宽度等于内容宽度，左右留白写在轨道内才能在滚动到底时保留 */
.shelf__track {
  display: inline-flex;
  padding: 12px $page-gutter 4px;
}

.shelf__item {
  flex-shrink: 0;
  width: 110px;
  white-space: normal;
}

.shelf__item + .shelf__item {
  margin-left: 10px;
}

.shelf__empty {
  padding: 40px 0;
  color: $gray-600;
  font-size: 15px;
  text-align: center;
}
</style>
