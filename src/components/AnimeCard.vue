<script setup lang="ts">
import { computed } from "vue";

import type { AnimeCardFragment } from "@/graphql/generated/graphql";
import { getDisplayTitle } from "@/utils/format";
import { openPage } from "@/utils/navigation";
import { routes } from "@/utils/routes";

const props = defineProps<{
  anime: AnimeCardFragment;
  /** 名次，从 1 开始；不传时不显示角标 */
  rank?: number;
}>();

const title = computed(() => getDisplayTitle(props.anime.title));

const openDetail = () => {
  openPage(routes.anime(props.anime.animeId));
};
</script>

<template>
  <view class="anime-card" hover-class="anime-card--active" @tap="openDetail">
    <view class="cover">
      <image
        v-if="anime.coverImage"
        class="cover-image"
        :src="anime.coverImage"
        mode="aspectFill"
        lazy-load
      />
      <view v-else class="cover-empty">暂无封面</view>

      <view
        v-if="rank"
        class="rank"
        :class="{ 'rank--top1': rank === 1, 'rank--top2': rank === 2, 'rank--top3': rank === 3 }"
      >
        {{ rank }}
      </view>

      <view v-if="anime.averageScore" class="cover-shade" />
      <text v-if="anime.averageScore" class="cover-score">
        {{ anime.averageScore.toFixed(0) }}
      </text>
    </view>

    <view class="title">{{ title }}</view>
  </view>
</template>

<style lang="scss" scoped>
.anime-card {
  display: block;
  width: 100%;
}

.anime-card--active {
  opacity: 0.7;
}

/* 用 padding 撑出 1:1.4 的封面比例，部分小程序内核不支持 aspect-ratio */
.cover {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 140%;
  overflow: hidden;
  border-radius: 12px;
  background-color: $gray-100;
  box-shadow: 0 0 0 1px rgba(16, 24, 40, 0.1);
}

.cover-image,
.cover-empty {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.cover-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $gray-200;
  color: $gray-400;
  font-size: 13px;
}

.rank {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 24px;
  height: 22px;
  padding: 0 6px;
  border-bottom-right-radius: 10px;
  box-sizing: border-box;
  background-color: rgba(16, 24, 40, 0.72);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  line-height: 22px;
  text-align: center;
}

.rank--top1 {
  background-color: $rank-gold;
}

.rank--top2 {
  background-color: $rank-silver;
}

.rank--top3 {
  background-color: $rank-bronze;
}

.cover-shade {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 48px;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
}

.cover-score {
  position: absolute;
  right: 10px;
  bottom: 4px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

.title {
  display: -webkit-box;
  height: 2.8em;
  margin-top: 6px;
  padding: 0 2px;
  overflow: hidden;
  color: $gray-800;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  overflow-wrap: break-word;
  -webkit-line-clamp: 2;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
}
</style>
