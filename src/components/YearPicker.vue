<script setup lang="ts">
import { computed } from "vue";

import { generateYearOptionsFrom } from "@/constants/ui-options";
import { EARLIEST_YEAR } from "@/utils/season";

const year = defineModel<number>({ required: true });

const options = generateYearOptionsFrom(EARLIEST_YEAR);
const labels = options.map((option) => option.label);

const selectedIndex = computed(() =>
  Math.max(
    options.findIndex((option) => option.value === year.value),
    0,
  ),
);

const onChange = (event: { detail: { value: number | string } }) => {
  const option = options[Number(event.detail.value)];
  if (option) year.value = option.value;
};
</script>

<template>
  <picker mode="selector" :range="labels" :value="selectedIndex" @change="onChange">
    <view class="trigger">
      <text>{{ year }}年</text>
      <view class="caret" />
    </view>
  </picker>
</template>

<style lang="scss" scoped>
.trigger {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-radius: 9px;
  background-color: $gray-100;
  color: $gray-900;
  font-size: 14px;
  font-weight: 600;
}

.caret {
  width: 5px;
  height: 5px;
  margin: -3px 0 0 8px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
}
</style>
