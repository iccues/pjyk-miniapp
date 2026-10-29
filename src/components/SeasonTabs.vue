<script setup lang="ts">
import { computed } from "vue";

import {
  formatSeason,
  getCurrentSeason,
  getPreviousSeason,
  isSameSeason,
  listSeasonsBackward,
  type SeasonKey,
} from "@/utils/season";

import TabItem from "./TabItem.vue";

const season = defineModel<SeasonKey>({ required: true });

// 最近两年的季度直接平铺，更早的放进"更早"选择器
const RECENT_COUNT = 8;

const recentSeasons = listSeasonsBackward(getCurrentSeason(), RECENT_COUNT);
const olderSeasons = listSeasonsBackward(
  getPreviousSeason(recentSeasons[recentSeasons.length - 1]!),
);
const olderLabels = olderSeasons.map(formatSeason);

const tabs = computed(() =>
  recentSeasons.map((key) => ({
    id: `${key.year}-${key.season}`,
    key,
    label: formatSeason(key),
    active: isSameSeason(key, season.value),
  })),
);

const olderIndex = computed(() => olderSeasons.findIndex((key) => isSameSeason(key, season.value)));
const pickerIndex = computed(() => Math.max(olderIndex.value, 0));
const olderLabel = computed(() => olderLabels[olderIndex.value] ?? "更早");

const select = (key: SeasonKey) => {
  season.value = key;
};

const onPickOlder = (event: { detail: { value: number | string } }) => {
  const key = olderSeasons[Number(event.detail.value)];
  if (key) season.value = key;
};
</script>

<template>
  <scroll-view class="season-tabs" scroll-x :show-scrollbar="false" enhanced>
    <view class="track">
      <view v-for="tab in tabs" :key="tab.id" class="item">
        <TabItem :label="tab.label" :active="tab.active" @select="select(tab.key)" />
      </view>

      <picker
        class="item"
        mode="selector"
        :range="olderLabels"
        :value="pickerIndex"
        @change="onPickOlder"
      >
        <TabItem :label="olderLabel" :active="olderIndex >= 0" caret />
      </picker>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.season-tabs {
  width: 100%;
  height: $list-tabs-height;
  white-space: nowrap;
}

/* 固定高度：H5 下 picker 自带的样式会把整行撑高 */
.track {
  display: inline-flex;
  align-items: center;
  height: $list-tabs-height;
  padding: 0 $page-gutter;
}

/* 标签在横向滚动区域里不能被压缩，否则文字会折行 */
.item {
  flex-shrink: 0;
}

.item + .item {
  margin-left: 20px;
}
</style>
