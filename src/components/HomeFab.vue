<script setup lang="ts">
import { goHome } from "@/utils/navigation";
</script>

<template>
  <!-- 从分享卡片直接打开普通页面时没有上一页，用它回到首页 -->
  <view class="home-fab" hover-class="home-fab--active" @tap="goHome">
    <image class="home-fab__icon" src="/static/icons/home-dark.png" mode="aspectFit" />
    <text>首页</text>
  </view>
</template>

<style lang="scss">
.home-fab {
  position: fixed;
  right: $page-gutter;
  bottom: calc(24px + env(safe-area-inset-bottom));
  z-index: 20;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px 0 12px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.16);
  color: $gray-900;
  font-size: 14px;
  font-weight: 600;
}

.home-fab--active {
  background-color: $gray-100;
}

.home-fab__icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
}
</style>
