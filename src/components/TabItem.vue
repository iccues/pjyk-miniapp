<script setup lang="ts">
// 带下划线的文字标签，新番的季度和榜单的年度/历史共用，保证两页顶部一致
defineProps<{
  label: string;
  active: boolean;
  /** 显示下拉箭头，用于点开后弹出选择器的标签 */
  caret?: boolean;
}>();

const emit = defineEmits<{ select: [] }>();
</script>

<template>
  <!-- 文字直接放在 view 里：H5 的 text 组件自带 pre-line，会让 nowrap 失效 -->
  <view class="tab" :class="{ 'tab--active': active }" @tap="emit('select')">
    {{ label }}
    <view v-if="caret" class="caret" />
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

.caret {
  width: 5px;
  height: 5px;
  margin: -3px 0 0 6px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
}
</style>
