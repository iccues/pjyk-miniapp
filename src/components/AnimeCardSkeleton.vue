<template>
  <view class="skeleton">
    <view class="skeleton-cover" />
    <view class="skeleton-line" />
    <view class="skeleton-line skeleton-line--short" />
  </view>
</template>

<style lang="scss" scoped>
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

.skeleton {
  width: 100%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-cover {
  width: 100%;
  height: 0;
  padding-top: 140%;
  border-radius: 16px;
  background-color: $gray-200;
}

.skeleton-line {
  height: 14px;
  margin: 8px 4px 0;
  border-radius: 999px;
  background-color: $gray-200;
}

.skeleton-line--short {
  width: 66%;
}
</style>
