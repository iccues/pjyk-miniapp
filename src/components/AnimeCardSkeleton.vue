<template>
  <view class="card-skeleton">
    <view class="card-skeleton__cover" />
    <view class="card-skeleton__line" />
    <view class="card-skeleton__line card-skeleton__line--short" />
  </view>
</template>

<style lang="scss">
@keyframes card-skeleton-pulse {
  50% {
    opacity: 0.5;
  }
}

.card-skeleton {
  width: 100%;
  animation: card-skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.card-skeleton__cover {
  width: 100%;
  height: 0;
  padding-top: 140%;
  border-radius: 16px;
  background-color: $gray-200;
}

.card-skeleton__line {
  height: 14px;
  margin: 8px 4px 0;
  border-radius: 999px;
  background-color: $gray-200;
}

.card-skeleton__line--short {
  width: 66%;
}
</style>
