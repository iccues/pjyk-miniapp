<script setup lang="ts">
import type { ListLayout } from "@/constants/ui-options";

const layout = defineModel<ListLayout>({ required: true });

const toggle = () => {
  layout.value = layout.value === "grid" ? "row" : "grid";
};
</script>

<template>
  <!-- 图标表示点击后切换到的样式 -->
  <view class="toggle" hover-class="toggle--active" @tap="toggle">
    <view v-if="layout === 'grid'" class="icon-rows">
      <view class="bar" />
      <view class="bar" />
      <view class="bar" />
    </view>
    <view v-else class="icon-grid">
      <view class="cell" />
      <view class="cell" />
      <view class="cell" />
      <view class="cell" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.toggle--active {
  background-color: $gray-100;
}

.icon-rows {
  width: 16px;
}

.bar {
  height: 2px;
  border-radius: 1px;
  background-color: $gray-700;
}

.bar + .bar {
  margin-top: 4px;
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 16px;
  height: 16px;
  align-content: space-between;
}

.cell {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background-color: $gray-700;
}
</style>
