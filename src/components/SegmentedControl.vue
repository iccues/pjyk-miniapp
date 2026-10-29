<script setup lang="ts" generic="T extends string | number | undefined">
import type { SelectOption } from "@/constants/ui-options";

// 筛选栏里的季度和排序共用这一种控件
const props = defineProps<{
  options: readonly SelectOption<T>[];
  value: T;
  /** 禁用时整组变灰且不响应点击，例如没选年份时的季度 */
  disabled?: boolean;
}>();

const emit = defineEmits<{ change: [value: T] }>();

const select = (option: SelectOption<T>) => {
  if (!props.disabled && option.value !== props.value) emit("change", option.value);
};
</script>

<template>
  <view class="segmented" :class="{ 'segmented--disabled': disabled }">
    <view
      v-for="option in options"
      :key="option.label"
      class="option"
      :class="{ 'option--active': option.value === value }"
      @tap="select(option)"
    >
      {{ option.label }}
    </view>
  </view>
</template>

<style lang="scss" scoped>
.segmented {
  display: flex;
  flex-shrink: 0;
  padding: 3px;
  border-radius: 9px;
  background-color: $gray-100;
}

.option {
  height: 26px;
  padding: 0 10px;
  border-radius: 7px;
  color: $gray-600;
  font-size: 13px;
  line-height: 26px;
  white-space: nowrap;
}

.option--active {
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.12);
  color: $gray-900;
  font-weight: 600;
}

.segmented--disabled .option {
  color: $gray-300;
}

.segmented--disabled .option--active {
  box-shadow: none;
  color: $gray-400;
}
</style>
