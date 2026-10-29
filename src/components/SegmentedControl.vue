<script setup lang="ts" generic="T extends string | number">
import type { SelectOption } from "@/constants/ui-options";

const props = defineProps<{
  options: readonly SelectOption<T>[];
  value: T;
}>();

const emit = defineEmits<{ change: [value: T] }>();

const select = (option: SelectOption<T>) => {
  if (option.value !== props.value) emit("change", option.value);
};
</script>

<template>
  <view class="segmented">
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
  padding: 3px;
  border-radius: 9px;
  background-color: $gray-100;
}

.option {
  height: 26px;
  padding: 0 12px;
  border-radius: 7px;
  color: $gray-600;
  font-size: 13px;
  line-height: 26px;
}

.option--active {
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.12);
  color: $gray-900;
  font-weight: 600;
}
</style>
