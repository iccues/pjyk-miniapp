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
    <view class="mask" @tap="emit('close')" />
    <view class="panel">
      <view class="head">
        <text class="title">{{ title }}</text>
        <view class="close" hover-class="close--active" @tap="emit('close')">
          <view class="close-icon" />
        </view>
      </view>
      <slot />
    </view>
  </view>
</template>

<style lang="scss" scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
}

@keyframes slide-up {
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

.mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(16, 24, 40, 0.45);
  animation: fade-in 0.2s ease-out;
}

.panel {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 8px $page-gutter calc(24px + env(safe-area-inset-bottom));
  border-radius: 20px 20px 0 0;
  background-color: #fff;
  animation: slide-up 0.25s ease-out;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
}

.title {
  color: $gray-900;
  font-size: 17px;
  font-weight: 700;
}

.close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: -6px;
  border-radius: 16px;
}

.close--active {
  background-color: $gray-100;
}

.close-icon {
  position: relative;
  width: 14px;
  height: 14px;
}

.close-icon::before,
.close-icon::after {
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

.close-icon::after {
  transform: rotate(-45deg);
}
</style>
