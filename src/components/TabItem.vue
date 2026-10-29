<script setup lang="ts">
// 带下划线的文字标签，用于筛选栏的季度
const props = defineProps<{
  label: string;
  active: boolean;
  /** 禁用时变灰且不响应点击，例如没选年份时的季度 */
  disabled?: boolean;
}>();

const emit = defineEmits<{ select: [] }>();

const onTap = () => {
  if (!props.disabled) emit("select");
};
</script>

<template>
  <!-- 文字直接放在 view 里：H5 的 text 组件自带 pre-line，会让 nowrap 失效 -->
  <view class="tab" :class="{ 'tab--active': active, 'tab--disabled': disabled }" @tap="onTap">
    {{ label }}
  </view>
</template>

<style lang="scss" scoped>
.tab {
  position: relative;
  display: flex;
  align-items: center;
  height: $list-tabs-height;
  color: $gray-500;
  font-size: 15px;
  white-space: nowrap;
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

.tab--disabled {
  color: $gray-300;
}

.tab--disabled::after {
  background-color: $gray-300;
}
</style>
