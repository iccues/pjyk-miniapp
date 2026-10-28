<script setup lang="ts">
import type { AnimeListItem } from "@/composables/usePagedAnimeList";

import AnimeCard from "./AnimeCard.vue";
import AnimeCardSkeleton from "./AnimeCardSkeleton.vue";

defineProps<{
  items: AnimeListItem[];
  total: number;
  loading: boolean;
  finished: boolean;
  error?: string;
}>();

const emit = defineEmits<{ retry: [] }>();

const skeletonCount = 9;
</script>

<template>
  <view v-if="items.length === 0 && loading" class="grid">
    <view v-for="index in skeletonCount" :key="index">
      <AnimeCardSkeleton />
    </view>
  </view>

  <view v-else-if="items.length === 0 && error" class="state state--error" @tap="emit('retry')">
    {{ error }}，点击重试
  </view>

  <view v-else-if="items.length === 0" class="state">暂无数据</view>

  <view v-else>
    <view class="grid">
      <view v-for="anime in items" :key="anime.animeId">
        <AnimeCard :anime="anime" />
      </view>
    </view>

    <view v-if="error" class="footer footer--error" @tap="emit('retry')">加载失败，点击重试</view>
    <view v-else-if="loading" class="footer">加载中…</view>
    <view v-else-if="finished" class="footer">共 {{ total }} 部</view>
    <view v-else class="footer">上拉加载更多</view>
  </view>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 12px;
  row-gap: 20px;
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
