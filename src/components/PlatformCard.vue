<script setup lang="ts">
import { computed } from "vue";

import { getPlatformConfig } from "@/constants/platforms";
import type { MappingItemFragment } from "@/graphql/generated/graphql";
import { formatInteger } from "@/utils/format";

const props = defineProps<{
  mapping: MappingItemFragment;
}>();

const platformConfig = computed(() => getPlatformConfig(props.mapping.sourcePlatform));
const animeUrl = computed(() => platformConfig.value.getAnimeUrl?.(props.mapping.platformId));

const hasMetrics = computed(
  () =>
    props.mapping.rawScore != null ||
    props.mapping.rawPopularity != null ||
    props.mapping.normalizedPopularity != null,
);

// 小程序不能直接打开外部网站，点击卡片复制该平台的条目链接
const copyLink = () => {
  if (!animeUrl.value) return;
  uni.setClipboardData({
    data: animeUrl.value,
    success: () => uni.showToast({ title: "链接已复制", icon: "none" }),
  });
};
</script>

<template>
  <view class="platform-card" hover-class="platform-card--active" @tap="copyLink">
    <view class="header">
      <image v-if="platformConfig.logo" class="logo" :src="platformConfig.logo" mode="aspectFit" />
      <text class="name">{{ platformConfig.name }}</text>
      <text v-if="animeUrl" class="action">复制链接</text>
    </view>

    <!-- 标准化评分 -->
    <view v-if="mapping.normalizedScore != null" class="score">
      <text class="score-value">{{ mapping.normalizedScore.toFixed(1) }}</text>
      <text class="score-label">标准化评分</text>
    </view>

    <!-- 补充评分与人气数据；无内容时隐藏 -->
    <view v-if="hasMetrics" class="metrics">
      <view v-if="mapping.rawScore != null" class="metric">
        <text class="metric-label">原始评分</text>
        <text class="metric-value metric-value--score">{{ mapping.rawScore.toFixed(1) }}</text>
      </view>
      <view v-if="mapping.rawPopularity != null" class="metric">
        <text class="metric-label">原始人气</text>
        <text class="metric-value metric-value--popularity">
          {{ formatInteger(mapping.rawPopularity) }}
        </text>
      </view>
      <view v-if="mapping.normalizedPopularity != null" class="metric">
        <text class="metric-label">标准化人气</text>
        <text class="metric-value metric-value--popularity">
          {{ formatInteger(mapping.normalizedPopularity) }}
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.platform-card {
  padding: 18px;
  border: 1px solid $gray-100;
  border-radius: 16px;
  background-color: rgba(249, 250, 251, 0.5);
}

.platform-card--active {
  background-color: $gray-100;
}

.header {
  display: flex;
  align-items: center;
}

.logo {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.name {
  color: $gray-800;
  font-size: 15px;
  font-weight: 600;
}

.action {
  margin-left: auto;
  color: $gray-400;
  font-size: 12px;
}

.score {
  display: flex;
  align-items: baseline;
  margin-top: 12px;
}

.score-value {
  margin-right: 8px;
  color: $indigo-600;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.score-label {
  color: $gray-500;
  font-size: 13px;
}

.metrics {
  display: flex;
  flex-wrap: wrap;
  margin-top: 4px;
}

.metric {
  display: flex;
  flex-direction: column;
  margin: 8px 24px 0 0;
}

.metric-label {
  color: $gray-500;
  font-size: 12px;
}

.metric-value {
  margin-top: 2px;
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.metric-value--score {
  color: $indigo-600;
}

.metric-value--popularity {
  color: $pink-500;
}
</style>
