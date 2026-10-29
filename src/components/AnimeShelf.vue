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
    <view class="header">
      <text class="title">{{ title }}</text>
      <text v-if="subtitle" class="subtitle">{{ subtitle }}</text>
      <view class="more" hover-class="more--active" @tap="emit('more')">
        <text>查看全部</text>
        <view class="arrow" />
      </view>
    </view>

    <view v-if="!loading && !animeList?.length" class="empty">暂无数据</view>

    <scroll-view v-else class="scroll" scroll-x :show-scrollbar="false" enhanced>
      <view class="track">
        <template v-if="loading && !animeList?.length">
          <view v-for="index in 4" :key="index" class="item">
            <AnimeCardSkeleton />
          </view>
        </template>
        <template v-else>
          <view v-for="anime in animeList" :key="anime.animeId" class="item">
            <AnimeCard :anime="anime" />
          </view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: baseline;
  padding: 0 $page-gutter;
}

.title {
  color: $gray-900;
  font-size: 17px;
  font-weight: 700;
}

.subtitle {
  margin-left: 8px;
  color: $gray-400;
  font-size: 13px;
}

.more {
  display: flex;
  align-items: center;
  margin-left: auto;
  color: $gray-500;
  font-size: 13px;
}

.more--active {
  opacity: 0.6;
}

.arrow {
  width: 6px;
  height: 6px;
  margin-left: 4px;
  border-top: 1.5px solid currentColor;
  border-right: 1.5px solid currentColor;
  transform: rotate(45deg);
}

.scroll {
  width: 100%;
  white-space: nowrap;
}

/* inline-flex 让轨道宽度等于内容宽度，左右留白写在轨道内才能在滚动到底时保留 */
.track {
  display: inline-flex;
  padding: 12px $page-gutter 4px;
}

.item {
  flex-shrink: 0;
  width: 220rpx;
  white-space: normal;
}

.item + .item {
  margin-left: 10px;
}

.empty {
  padding: 40px 0;
  color: $gray-600;
  font-size: 15px;
  text-align: center;
}
</style>
