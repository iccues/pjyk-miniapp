<script setup lang="ts">
import type { ListLayout } from "@/constants/ui-options";

const layout = defineModel<ListLayout>({ required: true });

const toggle = () => {
  layout.value = layout.value === "grid" ? "row" : "grid";
};
</script>

<template>
  <!-- 图标表示点击后切换到的样式 -->
  <view class="layout-toggle" hover-class="layout-toggle--active" @tap="toggle">
    <view v-if="layout === 'grid'" class="layout-toggle__icon-rows">
      <view class="layout-toggle__bar" />
      <view class="layout-toggle__bar" />
      <view class="layout-toggle__bar" />
    </view>
    <view v-else class="layout-toggle__icon-grid">
      <view class="layout-toggle__cell" />
      <view class="layout-toggle__cell" />
      <view class="layout-toggle__cell" />
      <view class="layout-toggle__cell" />
    </view>
  </view>
</template>

<style lang="scss">
.layout-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.layout-toggle--active {
  background-color: $gray-100;
}

.layout-toggle__icon-rows {
  width: 16px;
}

.layout-toggle__bar {
  height: 2px;
  border-radius: 1px;
  background-color: $gray-700;
}

.layout-toggle__bar + .layout-toggle__bar {
  margin-top: 4px;
}

.layout-toggle__icon-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 16px;
  height: 16px;
  align-content: space-between;
}

.layout-toggle__cell {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background-color: $gray-700;
}
</style>
