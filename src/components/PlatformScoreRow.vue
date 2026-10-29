<script setup lang="ts">
import Taro from "@tarojs/taro";
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
const showActions = async () => {
  const url = animeUrl.value;
  if (!url) return;

  try {
    await Taro.showActionSheet({ itemList: [`复制 ${platformConfig.value.name} 条目链接`] });
    await Taro.setClipboardData({ data: url });
    await Taro.showToast({ title: "链接已复制", icon: "none" });
  } catch {
    // 取消操作或复制失败，不需要提示
  }
};
</script>

<template>
  <view class="platform-row" hover-class="platform-row--active" @tap="showActions">
    <view class="platform-row__head">
      <image
        v-if="platformConfig.logo"
        class="platform-row__logo"
        :src="platformConfig.logo"
        mode="aspectFit"
      />
      <text class="platform-row__name">{{ platformConfig.name }}</text>
      <text v-if="mapping.normalizedScore != null" class="platform-row__score">
        {{ mapping.normalizedScore.toFixed(1) }}
      </text>
      <text v-else class="platform-row__score platform-row__score--empty">暂无评分</text>
    </view>

    <view class="platform-row__track">
      <view class="platform-row__fill" :style="{ width: `${barWidth}%` }" />
    </view>

    <view v-if="details" class="platform-row__details">{{ details }}</view>
  </view>
</template>

<style lang="scss">
.platform-row {
  padding: 12px 0;
}

.platform-row--active {
  opacity: 0.6;
}

.platform-row__head {
  display: flex;
  align-items: center;
}

.platform-row__logo {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.platform-row__name {
  flex: 1;
  color: $gray-800;
  font-size: 15px;
  font-weight: 600;
}

.platform-row__score {
  color: $indigo-600;
  font-size: 18px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.platform-row__score--empty {
  color: $gray-400;
  font-size: 12px;
  font-weight: 400;
}

.platform-row__track {
  height: 6px;
  margin-top: 8px;
  overflow: hidden;
  border-radius: 3px;
  background-color: $gray-100;
}

.platform-row__fill {
  height: 100%;
  border-radius: 3px;
  background-image: linear-gradient(to right, $indigo-500, $indigo-600);
}

.platform-row__details {
  margin-top: 6px;
  color: $gray-500;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
</style>
