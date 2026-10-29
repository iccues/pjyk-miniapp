<script setup lang="ts">
import Taro from "@tarojs/taro";
import { computed } from "vue";

import { getNavBarMetrics, goHome } from "@/utils/navigation";

// 只有左上角的返回 / 回首页按钮，不显示标题
const props = defineProps<{
  /** 为 false 时背景透明、图标为白色，叠在封面头图上；滚动后切换为白底 */
  solid: boolean;
  /** 从分享卡片直接打开时没有上一页，左上角改为"回首页" */
  canGoBack: boolean;
}>();

const { statusBarHeight, navBarHeight } = getNavBarMetrics();

const icon = computed(() => {
  const name = props.canGoBack ? "back" : "home";
  return `/static/icons/${name}-${props.solid ? "dark" : "light"}.png`;
});

const onLeftTap = () => {
  if (props.canGoBack) {
    void Taro.navigateBack();
  } else {
    goHome();
  }
};
</script>

<template>
  <view
    class="detail-nav"
    :class="{ 'detail-nav--solid': solid }"
    :style="{ paddingTop: `${statusBarHeight}px` }"
  >
    <view class="detail-nav__bar" :style="{ height: `${navBarHeight}px` }">
      <view
        class="detail-nav__left"
        hover-class="detail-nav__left--active"
        :style="{ height: `${navBarHeight}px` }"
        @tap="onLeftTap"
      >
        <image class="detail-nav__icon" :src="icon" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.detail-nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 50;
  transition: background-color 0.2s;
}

.detail-nav--solid {
  background-color: #fff;
  box-shadow: 0 1px 0 $gray-100;
}

.detail-nav__bar {
  position: relative;
}

.detail-nav__left {
  position: absolute;
  top: 0;
  left: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  border-radius: 22px;
}

.detail-nav__left--active {
  opacity: 0.6;
}

.detail-nav__icon {
  width: 22px;
  height: 22px;
}
</style>
