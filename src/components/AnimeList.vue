<script setup lang="ts">
import type { AnimeListItem } from "@/composables/usePagedAnimeList";
import type { ListLayout } from "@/constants/ui-options";

import AnimeCard from "./AnimeCard.vue";
import AnimeCardSkeleton from "./AnimeCardSkeleton.vue";
import AnimeRowCard from "./AnimeRowCard.vue";

withDefaults(
  defineProps<{
    items: AnimeListItem[];
    layout: ListLayout;
    total: number;
    loading: boolean;
    finished: boolean;
    error?: string;
    /** 列表按评分或人气排序时显示名次；搜索结果按匹配度排列，不显示 */
    showRank?: boolean;
    emptyText?: string;
  }>(),
  { showRank: false, emptyText: "暂无数据" },
);

const emit = defineEmits<{ retry: [] }>();
</script>

<template>
  <!-- 首次加载 -->
  <view v-if="items.length === 0 && loading">
    <view v-if="layout === 'grid'" class="grid">
      <view v-for="index in 9" :key="index">
        <AnimeCardSkeleton />
      </view>
    </view>
    <view v-else>
      <view v-for="index in 6" :key="index" class="row-skeleton">
        <view class="row-skeleton-cover" />
        <view class="row-skeleton-info">
          <view class="row-skeleton-line" />
          <view class="row-skeleton-line row-skeleton-line--short" />
        </view>
      </view>
    </view>
  </view>

  <view v-else-if="items.length === 0 && error" class="state state--error" @tap="emit('retry')">
    {{ error }}，点击重试
  </view>

  <view v-else-if="items.length === 0" class="state">{{ emptyText }}</view>

  <view v-else>
    <view v-if="layout === 'grid'" class="grid">
      <view v-for="(anime, index) in items" :key="anime.animeId">
        <AnimeCard :anime="anime" :rank="showRank ? index + 1 : undefined" />
      </view>
    </view>
    <view v-else>
      <view v-for="(anime, index) in items" :key="anime.animeId" class="row">
        <AnimeRowCard :anime="anime" :rank="showRank ? index + 1 : undefined" />
      </view>
    </view>

    <view v-if="error" class="footer footer--error" @tap="emit('retry')">加载失败，点击重试</view>
    <view v-else-if="loading" class="footer">加载中…</view>
    <view v-else-if="finished" class="footer">共 {{ total }} 部</view>
    <view v-else class="footer">上拉加载更多</view>
  </view>
</template>

<style lang="scss" scoped>
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 10px;
  row-gap: 18px;
}

.row + .row {
  border-top: 1px solid $gray-100;
}

.row-skeleton {
  display: flex;
  align-items: center;
  padding: 10px 0;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.row-skeleton-cover {
  flex-shrink: 0;
  width: 56px;
  height: 78px;
  border-radius: 8px;
  background-color: $gray-200;
}

.row-skeleton-info {
  flex: 1;
  margin-left: 12px;
}

.row-skeleton-line {
  height: 14px;
  border-radius: 999px;
  background-color: $gray-200;
}

.row-skeleton-line + .row-skeleton-line {
  margin-top: 10px;
}

.row-skeleton-line--short {
  width: 50%;
}

.state {
  padding: 40px 0;
  color: $gray-600;
  font-size: 15px;
  text-align: center;
}

.state--error {
  color: $red-600;
}

.footer {
  padding: 24px 0;
  color: $gray-500;
  font-size: 14px;
  text-align: center;
}

.footer--error {
  color: $red-600;
}
</style>
