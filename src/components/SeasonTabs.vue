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
      <view
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ 'tab--active': tab.active }"
        @tap="select(tab.key)"
      >
        {{ tab.label }}
      </view>

      <picker
        class="older"
        mode="selector"
        :range="olderLabels"
        :value="pickerIndex"
        @change="onPickOlder"
      >
        <view class="tab tab--older" :class="{ 'tab--active': olderIndex >= 0 }">
          <text>{{ olderIndex >= 0 ? olderLabels[olderIndex] : "更早" }}</text>
          <view class="caret" />
        </view>
      </picker>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.season-tabs {
  width: 100%;
  white-space: nowrap;
}

/* 固定高度：H5 下 picker 自带的样式会把整行撑高，下划线跟着偏离文字 */
.track {
  display: inline-flex;
  align-items: center;
  height: 46px;
  padding: 0 $page-gutter;
}

.tab {
  position: relative;
  height: 46px;
  color: $gray-500;
  font-size: 15px;
  line-height: 46px;
}

.tab + .tab,
.older {
  margin-left: 20px;
}

.tab--active {
  color: $gray-900;
  font-weight: 700;
}

.tab--active::after {
  content: "";
  position: absolute;
  right: 20%;
  bottom: 5px;
  left: 20%;
  height: 3px;
  border-radius: 2px;
  background-color: $indigo-600;
}

.tab--older {
  display: flex;
  align-items: center;
}

.caret {
  width: 5px;
  height: 5px;
  margin: -3px 0 0 6px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
}
</style>
