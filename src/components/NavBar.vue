<script setup lang="ts">
import Taro, { useLoad } from "@tarojs/taro";
import { computed, ref } from "vue";

import { getNavBarMetrics, goHome, isEntryPage } from "@/utils/navigation";

/**
 * 所有页面共用的顶栏，平台的原生顶栏在 app.config.ts 里关掉了
 *
 * 占住状态栏和胶囊按钮那一行：左边是圆形的返回 / 回首页按钮，中间可以放内容（例如搜索框），
 * 右边留给平台的胶囊按钮。
 */
const props = withDefaults(
  defineProps<{
    /** 是否显示左上角的按钮，标签页不需要返回 */
    back?: boolean;
    /** 背景透明、按钮改为深色半透明底，用于叠在详情页的头图上 */
    transparent?: boolean;
    /** 固定在屏幕顶部；为 false 时跟着页面滚动 */
    fixed?: boolean;
    /** 固定时是否在原位置留出顶栏的高度；内容要从屏幕顶端开始画时关掉 */
    placeholder?: boolean;
  }>(),
  { back: true, transparent: false, fixed: true, placeholder: true },
);

const {
  statusBarHeight,
  navBarHeight,
  topHeight,
  menuButtonHeight,
  menuButtonMargin,
  menuButtonInset,
} = getNavBarMetrics();

// 从分享卡片直接打开时没有上一页，按钮改为"回首页"
const canGoBack = ref(true);

useLoad(() => {
  canGoBack.value = !isEntryPage();
});

const icon = computed(() => {
  const name = canGoBack.value ? "back" : "home";
  return `/static/icons/${name}-${props.transparent ? "light" : "dark"}.png`;
});

const buttonStyle = {
  width: `${menuButtonHeight}px`,
  height: `${menuButtonHeight}px`,
  marginLeft: `${menuButtonMargin}px`,
};

// 中间的内容从按钮右边（没有按钮时从页面左边距）开始，到胶囊按钮左边结束
const contentStyle = computed(() => ({
  height: `${menuButtonHeight}px`,
  marginLeft: props.back ? "8px" : "20px",
  marginRight: menuButtonInset ? `${menuButtonInset + 8}px` : "20px",
}));

const onButtonTap = () => {
  if (canGoBack.value) {
    void Taro.navigateBack();
  } else {
    goHome();
  }
};
</script>

<template>
  <view v-if="fixed && placeholder" :style="{ height: `${topHeight}px` }" />
  <view
    class="nav-bar"
    :class="{ 'nav-bar--fixed': fixed, 'nav-bar--transparent': transparent }"
    :style="{ paddingTop: `${statusBarHeight}px` }"
  >
    <view class="nav-bar__row" :style="{ height: `${navBarHeight}px` }">
      <view
        v-if="back"
        class="nav-bar__button"
        hover-class="nav-bar__button--active"
        :style="buttonStyle"
        @tap="onButtonTap"
      >
        <image class="nav-bar__icon" :src="icon" mode="aspectFit" />
      </view>
      <view class="nav-bar__content" :style="contentStyle">
        <slot />
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.nav-bar {
  background-color: #fff;
  transition: background-color 0.2s;
}

/* 比筛选栏（z-index: 10）低，筛选栏里打开的弹层才能盖住顶栏 */
.nav-bar--fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 5;
}

.nav-bar--transparent {
  background-color: transparent;
}

.nav-bar__row {
  display: flex;
  align-items: center;
}

.nav-bar__button {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 1px rgba(16, 24, 40, 0.08);
}

.nav-bar--transparent .nav-bar__button {
  background-color: rgba(16, 24, 40, 0.3);
  box-shadow: none;
}

.nav-bar__button--active {
  opacity: 0.6;
}

.nav-bar__icon {
  width: 18px;
  height: 18px;
}

.nav-bar__content {
  flex: 1;
  min-width: 0;
}
</style>
