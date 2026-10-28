<script setup lang="ts">
import type { AnimeCardFragment } from "@/graphql/generated/graphql";

import AnimeCard from "./AnimeCard.vue";
import AnimeCardSkeleton from "./AnimeCardSkeleton.vue";

const props = defineProps<{
  title: string;
  moreUrl: string;
  animeList?: AnimeCardFragment[];
  loading: boolean;
}>();

const skeletonCount = 4;

const openMore = () => {
  uni.navigateTo({ url: props.moreUrl });
};
</script>

<template>
  <view class="anime-row">
    <view class="header" hover-class="header--active" @tap="openMore">
      <text class="header-title">{{ title }}</text>
      <view class="header-arrow" />
    </view>

    <view v-if="!loading && !animeList?.length" class="empty">暂无数据</view>

    <scroll-view v-else class="scroll" scroll-x :show-scrollbar="false" enhanced>
      <view class="track">
        <template v-if="loading && !animeList?.length">
          <view v-for="index in skeletonCount" :key="index" class="item">
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
  align-items: center;
  padding: 0 $page-gutter;
}

.header--active {
  opacity: 0.6;
}

.header-title {
  color: $gray-900;
  font-size: 20px;
  font-weight: 700;
}

.header-arrow {
  width: 8px;
  height: 8px;
  margin-left: 6px;
  border-top: 2px solid $gray-400;
  border-right: 2px solid $gray-400;
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
  width: 240rpx;
  white-space: normal;
}

.item + .item {
  margin-left: 12px;
}

.empty {
  padding: 40px 0;
  color: $gray-600;
  font-size: 15px;
  text-align: center;
}
</style>
