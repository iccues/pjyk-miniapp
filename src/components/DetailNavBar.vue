<script setup lang="ts">
import { computed } from "vue";

import { getNavBarMetrics, goHome } from "@/utils/navigation";

const props = defineProps<{
  title: string;
  /** 为 false 时背景透明、图标为白色，叠在封面头图上；滚动后切换为白底 */
  solid: boolean;
  /** 从分享卡片直接打开时没有上一页，左上角改为"回首页" */
  canGoBack: boolean;
}>();

const { statusBarHeight, navBarHeight, capsuleSpace } = getNavBarMetrics();

const icon = computed(() => {
  const name = props.canGoBack ? "back" : "home";
  return `/static/icons/${name}-${props.solid ? "dark" : "light"}.png`;
});

const onLeftTap = () => {
  if (props.canGoBack) {
    uni.navigateBack();
  } else {
    goHome();
  }
};
</script>

<template>
  <view
    class="nav"
    :class="{ 'nav--solid': solid }"
    :style="{ paddingTop: `${statusBarHeight}px` }"
  >
    <view class="bar" :style="{ height: `${navBarHeight}px`, padding: `0 ${capsuleSpace}px` }">
      <view
        class="left"
        hover-class="left--active"
        :style="{ height: `${navBarHeight}px` }"
        @tap="onLeftTap"
      >
        <image class="icon" :src="icon" mode="aspectFit" />
      </view>
      <view class="title" :class="{ 'title--visible': solid }">{{ title }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 50;
  transition: background-color 0.2s;
}

.nav--solid {
  background-color: #fff;
  box-shadow: 0 1px 0 $gray-100;
}

.bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left {
  position: absolute;
  top: 0;
  left: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  border-radius: 22px;
}

.left--active {
  opacity: 0.6;
}

.icon {
  width: 22px;
  height: 22px;
}

.title {
  overflow: hidden;
  color: $gray-900;
  font-size: 16px;
  font-weight: 600;
  opacity: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.title--visible {
  opacity: 1;
}
</style>
