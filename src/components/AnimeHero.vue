<script setup lang="ts">
import { computed } from "vue";

import type { GetAnimeDetailQuery } from "@/graphql/generated/graphql";
import { formatInteger, getDisplayTitle } from "@/utils/format";

const props = defineProps<{
  anime: NonNullable<GetAnimeDetailQuery["anime"]>;
}>();

const displayTitle = computed(() => getDisplayTitle(props.anime.title));

// 罗马音和英文名经常相同（例如 Steins;Gate），去重后再展示
const subTitles = computed(() => {
  const t = props.anime.title;
  const candidates = [t.titleCn ? t.titleNative : null, t.titleRomaji, t.titleEn];
  const titles = candidates.filter(
    (title): title is string => !!title && title !== displayTitle.value,
  );
  return [...new Set(titles)];
});

const previewCover = () => {
  if (props.anime.coverImage) uni.previewImage({ urls: [props.anime.coverImage] });
};
</script>

<template>
  <view class="hero">
    <image
      v-if="anime.coverImage"
      class="cover"
      :src="anime.coverImage"
      mode="widthFix"
      @tap="previewCover"
    />

    <view class="title">{{ displayTitle }}</view>

    <view v-if="subTitles.length > 0" class="subtitles">
      <view v-for="(subTitle, index) in subTitles" :key="index" class="subtitle">
        {{ subTitle }}
      </view>
    </view>

    <view v-if="anime.startDate" class="meta">{{ anime.startDate }} 开播</view>

    <view class="stats">
      <view v-if="anime.averageScore" class="stat">
        <text class="stat-label">综合评分</text>
        <view class="stat-value-row">
          <text class="stat-value stat-value--score">{{ anime.averageScore.toFixed(1) }}</text>
          <text class="stat-unit">/100</text>
        </view>
      </view>
      <view v-if="anime.popularity" class="stat">
        <text class="stat-label">人气值</text>
        <text class="stat-value stat-value--popularity">
          {{ formatInteger(anime.popularity) }}
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px $page-gutter 0;
  text-align: center;
}

.cover {
  width: 220px;
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.title {
  color: $gray-900;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
}

.subtitles {
  margin-top: 12px;
}

.subtitle {
  color: $gray-500;
  font-size: 14px;
  line-height: 1.6;
}

.meta {
  margin-top: 12px;
  color: $gray-400;
  font-size: 14px;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 12px;
}

.stat-label {
  color: $gray-500;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.stat-value-row {
  display: flex;
  align-items: baseline;
}

.stat-value {
  margin-top: 4px;
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.stat-value--score {
  color: $indigo-600;
}

.stat-value--popularity {
  color: $pink-500;
}

.stat-unit {
  margin-left: 4px;
  color: $gray-400;
  font-size: 16px;
  font-weight: 500;
}
</style>
