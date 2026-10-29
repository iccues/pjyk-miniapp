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
      class="row-card__rank"
      :class="{
        'row-card__rank--top1': rank === 1,
        'row-card__rank--top2': rank === 2,
        'row-card__rank--top3': rank === 3,
      }"
    >
      {{ rank }}
    </view>

    <image
      v-if="anime.coverImage"
      class="row-card__cover"
      :src="anime.coverImage"
      mode="aspectFill"
      :lazy-load="true"
    />
    <view v-else class="row-card__cover row-card__cover--empty" />

    <view class="row-card__info">
      <view class="row-card__title">{{ title }}</view>
      <view v-if="nativeTitle" class="row-card__native-title">{{ nativeTitle }}</view>
      <view v-if="meta" class="row-card__meta">{{ meta }}</view>
    </view>

    <view v-if="anime.averageScore" class="row-card__score">{{
      anime.averageScore.toFixed(1)
    }}</view>
    <view v-else class="row-card__score row-card__score--empty">暂无评分</view>
  </view>
</template>

<style lang="scss">
.row-card {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.row-card--active {
  opacity: 0.7;
}

.row-card__rank {
  flex-shrink: 0;
  width: 28px;
  margin-right: 8px;
  color: $gray-400;
  font-size: 17px;
  font-weight: 800;
  text-align: center;
}

.row-card__rank--top1 {
  color: $rank-gold;
}

.row-card__rank--top2 {
  color: $rank-silver;
}

.row-card__rank--top3 {
  color: $rank-bronze;
}

.row-card__cover {
  flex-shrink: 0;
  width: 56px;
  height: 78px;
  border-radius: 8px;
  background-color: $gray-200;
}

.row-card__info {
  flex: 1;
  min-width: 0;
  margin: 0 12px;
}

.row-card__title,
.row-card__native-title,
.row-card__meta {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-card__title {
  color: $gray-900;
  font-size: 15px;
  font-weight: 600;
}

.row-card__native-title {
  margin-top: 2px;
  color: $gray-500;
  font-size: 12px;
}

.row-card__meta {
  margin-top: 6px;
  color: $gray-400;
  font-size: 12px;
}

.row-card__score {
  flex-shrink: 0;
  color: $indigo-600;
  font-size: 22px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.row-card__score--empty {
  color: $gray-400;
  font-size: 12px;
  font-weight: 400;
}
</style>
