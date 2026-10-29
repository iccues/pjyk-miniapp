<script setup lang="ts">
defineProps<{
  visible: boolean;
  title: string;
}>();

const emit = defineEmits<{ close: [] }>();

// 弹层打开时拦截滑动，避免下面的页面跟着滚动
const blockScroll = () => {};
</script>

<template>
  <view v-if="visible" class="bottom-sheet" @touchmove.stop.prevent="blockScroll">
    <view class="bottom-sheet__mask" @tap="emit('close')" />
    <view class="bottom-sheet__panel">
      <view class="bottom-sheet__head">
        <text class="bottom-sheet__title">{{ title }}</text>
        <view
          class="bottom-sheet__close"
          hover-class="bottom-sheet__close--active"
          @tap="emit('close')"
        >
          <view class="bottom-sheet__close-icon" />
        </view>
      </view>
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
@keyframes bottom-sheet-fade-in {
  from {
    opacity: 0;
  }
}

@keyframes bottom-sheet-slide-up {
  from {
    transform: translateY(100%);
  }
}

.bottom-sheet {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
}

/*
 * H5 的标签栏是叠在页面上的普通元素，标签页里的弹层要让出它的高度，和小程序一样停在标签栏上方；
 * 小程序的原生标签栏在页面区域之外，也没有 .taro_tabbar_page，不受影响
 */
.taro_tabbar_page .bottom-sheet {
  bottom: calc(var(--taro-tabbar-height, 50px) + env(safe-area-inset-bottom));
}

.bottom-sheet__mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(16, 24, 40, 0.45);
  animation: bottom-sheet-fade-in 0.2s ease-out;
}

.bottom-sheet__panel {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 8px $page-gutter calc(24px + env(safe-area-inset-bottom));
  border-radius: 20px 20px 0 0;
  background-color: #fff;
  animation: bottom-sheet-slide-up 0.25s ease-out;
}

.bottom-sheet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
}

.bottom-sheet__title {
  color: $gray-900;
  font-size: 17px;
  font-weight: 700;
}

.bottom-sheet__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: -6px;
  border-radius: 16px;
}

.bottom-sheet__close--active {
  background-color: $gray-100;
}

.bottom-sheet__close-icon {
  position: relative;
  width: 14px;
  height: 14px;
}

.bottom-sheet__close-icon::before,
.bottom-sheet__close-icon::after {
  content: "";
  position: absolute;
  top: 6px;
  left: -1px;
  width: 16px;
  height: 2px;
  border-radius: 1px;
  background-color: $gray-500;
  transform: rotate(45deg);
}

.bottom-sheet__close-icon::after {
  transform: rotate(-45deg);
}

/* 以下供插槽内容使用：说明条目和底部的主按钮 */
.bottom-sheet__item + .bottom-sheet__item {
  margin-top: 16px;
}

.bottom-sheet__item-title {
  color: $gray-900;
  font-size: 15px;
  font-weight: 600;
}

.bottom-sheet__item-text {
  margin-top: 4px;
  color: $gray-600;
  font-size: 14px;
  line-height: 1.6;
}

.bottom-sheet__button {
  margin-top: 24px;
  border-radius: 12px;
  background-color: $gray-900;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 44px;
  text-align: center;
}

.bottom-sheet__button--active {
  background-color: $gray-700;
}
</style>
