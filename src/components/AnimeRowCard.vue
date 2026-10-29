<script setup lang="ts">
import { computed } from "vue";

import type { AnimeCardFragment } from "@/graphql/generated/graphql";
import { formatCompact, formatStartMonth, getDisplayTitle } from "@/utils/format";
import { openPage } from "@/utils/navigation";
import { routes } from "@/utils/routes";

const props = defineProps<{
  anime: AnimeCardFragment;
  /** 名次，从 1 开始；不传时不显示名次列 */
  rank?: number;
}>();

const title = computed(() => getDisplayTitle(props.anime.title));

// 原名和展示标题相同（没有中文名）时不重复显示
const nativeTitle = computed(() =>
  props.anime.title.titleNative !== title.value ? props.anime.title.titleNative : "",
);

const meta = computed(() => {
  const parts: string[] = [];
  if (props.anime.startDate) parts.push(`${formatStartMonth(props.anime.startDate)}开播`);
  if (props.anime.popularity) parts.push(`人气 ${formatCompact(props.anime.popularity)}`);
  return parts.join(" · ");
});

const openDetail = () => {
  openPage(routes.anime(props.anime.animeId));
};
</script>

<template>
  <view class="row-card" hover-class="row-card--active" @tap="openDetail">
    <view
      v-if="rank"
      class="rank"
      :class="{ 'rank--top1': rank === 1, 'rank--top2': rank === 2, 'rank--top3': rank === 3 }"
    >
      {{ rank }}
    </view>

    <image
      v-if="anime.coverImage"
      class="cover"
      :src="anime.coverImage"
      mode="aspectFill"
      lazy-load
    />
    <view v-else class="cover cover--empty" />

    <view class="info">
      <view class="title">{{ title }}</view>
      <view v-if="nativeTitle" class="native-title">{{ nativeTitle }}</view>
      <view v-if="meta" class="meta">{{ meta }}</view>
    </view>

    <view v-if="anime.averageScore" class="score">{{ anime.averageScore.toFixed(1) }}</view>
    <view v-else class="score score--empty">暂无评分</view>
  </view>
</template>

<style lang="scss" scoped>
.row-card {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.row-card--active {
  opacity: 0.7;
}

.rank {
  flex-shrink: 0;
  width: 28px;
  margin-right: 8px;
  color: $gray-400;
  font-size: 17px;
  font-weight: 800;
  text-align: center;
}

.rank--top1 {
  color: $rank-gold;
}

.rank--top2 {
  color: $rank-silver;
}

.rank--top3 {
  color: $rank-bronze;
}

.cover {
  flex-shrink: 0;
  width: 56px;
  height: 78px;
  border-radius: 8px;
  background-color: $gray-200;
}

.info {
  flex: 1;
  min-width: 0;
  margin: 0 12px;
}

.title,
.native-title,
.meta {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title {
  color: $gray-900;
  font-size: 15px;
  font-weight: 600;
}

.native-title {
  margin-top: 2px;
  color: $gray-500;
  font-size: 12px;
}

.meta {
  margin-top: 6px;
  color: $gray-400;
  font-size: 12px;
}

.score {
  flex-shrink: 0;
  color: $indigo-600;
  font-size: 22px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.score--empty {
  color: $gray-400;
  font-size: 12px;
  font-weight: 400;
}
</style>
