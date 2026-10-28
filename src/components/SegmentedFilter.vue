<script setup lang="ts" generic="T extends string | number | undefined">
import type { SelectOption } from "@/constants/ui-options";

const props = defineProps<{
  label: string;
  options: readonly SelectOption<T>[];
  value: T;
  disabled?: boolean;
}>();

const emit = defineEmits<{ change: [value: T] }>();

const select = (option: SelectOption<T>) => {
  if (props.disabled || option.value === props.value) return;
  emit("change", option.value);
};
</script>

<template>
  <view class="filter">
    <text class="label">{{ label }}</text>

    <view class="segmented">
      <view
        v-for="option in options"
        :key="option.label"
        class="option"
        :class="{
          'option--active': option.value === value,
          'option--disabled': disabled,
        }"
        @tap="select(option)"
      >
        {{ option.label }}
      </view>
    </view>
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

.segmented {
  display: flex;
  flex-wrap: wrap;
  padding: 3px;
  border-radius: 10px;
  background-color: $gray-100;
}

/* 选中态的边框宽度与普通态一致，切换时文字不跳动 */
.option {
  height: 28px;
  padding: 0 9px;
  border: 1px solid transparent;
  border-radius: 7px;
  box-sizing: border-box;
  color: $gray-600;
  font-size: 14px;
  line-height: 26px;
}

.option + .option {
  margin-left: 2px;
}

.option--active {
  border-color: $gray-500;
  background-color: #fff;
  color: $gray-900;
  font-weight: 600;
}

.option--disabled {
  color: $gray-300;
}

.option--active.option--disabled {
  border-color: $gray-300;
  color: $gray-400;
}
</style>
