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

// 标准化评分理论上在 0–100，极端作品可能越界，横条按 0–100 截断
const barWidth = computed(() => Math.min(Math.max(props.mapping.normalizedScore ?? 0, 0), 100));

const details = computed(() => {
  const { rawScore, rawPopularity, normalizedPopularity } = props.mapping;
  const parts: string[] = [];
  if (rawScore != null) parts.push(`原始评分 ${rawScore.toFixed(1)}`);
  if (rawPopularity != null) parts.push(`原始人气 ${formatInteger(rawPopularity)}`);
  if (normalizedPopularity != null) parts.push(`标准化人气 ${formatInteger(normalizedPopularity)}`);
  return parts.join(" · ");
});

// 小程序不能直接打开外部网站，改为复制该平台的条目链接
const showActions = () => {
  const url = animeUrl.value;
  if (!url) return;

  uni.showActionSheet({
    itemList: [`复制 ${platformConfig.value.name} 条目链接`],
    success: () => {
      uni.setClipboardData({
        data: url,
        success: () => uni.showToast({ title: "链接已复制", icon: "none" }),
      });
    },
  });
};
</script>

<template>
  <view class="platform" hover-class="platform--active" @tap="showActions">
    <view class="head">
      <image v-if="platformConfig.logo" class="logo" :src="platformConfig.logo" mode="aspectFit" />
      <text class="name">{{ platformConfig.name }}</text>
      <text v-if="mapping.normalizedScore != null" class="score">
        {{ mapping.normalizedScore.toFixed(1) }}
      </text>
      <text v-else class="score score--empty">暂无评分</text>
    </view>

    <view class="track">
      <view class="fill" :style="{ width: `${barWidth}%` }" />
    </view>

    <view v-if="details" class="details">{{ details }}</view>
  </view>
</template>

<style lang="scss" scoped>
.platform {
  padding: 12px 0;
}

.platform--active {
  opacity: 0.6;
}

.head {
  display: flex;
  align-items: center;
}

.logo {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.name {
  flex: 1;
  color: $gray-800;
  font-size: 15px;
  font-weight: 600;
}

.score {
  color: $indigo-600;
  font-size: 18px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.score--empty {
  color: $gray-400;
  font-size: 12px;
  font-weight: 400;
}

.track {
  height: 6px;
  margin-top: 8px;
  overflow: hidden;
  border-radius: 3px;
  background-color: $gray-100;
}

.fill {
  height: 100%;
  border-radius: 3px;
  background-image: linear-gradient(to right, $indigo-500, $indigo-600);
}

.details {
  margin-top: 6px;
  color: $gray-500;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
</style>
