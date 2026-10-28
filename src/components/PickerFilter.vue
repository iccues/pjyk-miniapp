<script setup lang="ts" generic="T extends string | number | undefined">
import { computed } from "vue";

import type { SelectOption } from "@/constants/ui-options";

const props = defineProps<{
  label: string;
  options: readonly SelectOption<T>[];
  value: T;
}>();

const emit = defineEmits<{ change: [value: T] }>();

const labels = computed(() => props.options.map((option) => option.label));

const selectedIndex = computed(() =>
  Math.max(
    props.options.findIndex((option) => option.value === props.value),
    0,
  ),
);

// 值不在选项里时（例如分享链接带了超出范围的年份）显示原值，避免按钮空白
const currentLabel = computed(() => {
  const matched = props.options.find((option) => option.value === props.value);
  return matched?.label ?? String(props.value ?? props.label);
});

const onChange = (event: { detail: { value: number | string } }) => {
  const option = props.options[Number(event.detail.value)];
  if (option && option.value !== props.value) emit("change", option.value);
};
</script>

<template>
  <view class="filter">
    <text class="label">{{ label }}</text>

    <picker mode="selector" :range="labels" :value="selectedIndex" @change="onChange">
      <view class="trigger">
        <text>{{ currentLabel }}</text>
        <view class="caret" />
      </view>
    </picker>
  </view>
</template>

<style lang="scss" scoped>
.filter {
  display: flex;
  align-items: center;
}

.label {
  flex-shrink: 0;
  margin-right: 6px;
  color: $gray-600;
  font-size: 13px;
  font-weight: 600;
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  min-width: 96px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid $gray-500;
  border-radius: 8px;
  background-color: #fff;
  color: $gray-900;
  font-size: 14px;
  font-weight: 600;
}

.caret {
  width: 6px;
  height: 6px;
  margin: -3px 0 0 8px;
  border-right: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  transform: rotate(45deg);
}
</style>
