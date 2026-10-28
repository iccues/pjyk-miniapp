<script setup lang="ts">
import { computed } from "vue";

import type { AnimeCardFragment } from "@/graphql/generated/graphql";
import { getDisplayTitle } from "@/utils/format";
import { routes } from "@/utils/routes";

const props = defineProps<{
  anime: AnimeCardFragment;
}>();

const title = computed(() => getDisplayTitle(props.anime.title));

const openDetail = () => {
  uni.navigateTo({ url: routes.animeDetail(props.anime.animeId) });
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
  border-radius: 16px;
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
  margin-top: 8px;
  padding: 0 4px;
  overflow: hidden;
  color: $gray-800;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  overflow-wrap: break-word;
  -webkit-line-clamp: 2;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
}
</style>
