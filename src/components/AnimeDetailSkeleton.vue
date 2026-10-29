<script setup lang="ts">
// 与详情页头图区域对齐，topOffset 为自定义导航栏的总高度
defineProps<{ topOffset: number }>();
</script>

<template>
  <view class="detail-skeleton">
    <view class="detail-skeleton__hero" :style="{ paddingTop: `${topOffset + 8}px` }">
      <view class="detail-skeleton__cover" />
      <view class="detail-skeleton__info">
        <view class="detail-skeleton__bar detail-skeleton__bar--title" />
        <view class="detail-skeleton__bar detail-skeleton__bar--line" />
        <view class="detail-skeleton__bar detail-skeleton__bar--short" />
      </view>
    </view>

    <view class="detail-skeleton__body">
      <view class="detail-skeleton__stats">
        <view class="detail-skeleton__stat" />
        <view class="detail-skeleton__stat" />
      </view>
      <view class="detail-skeleton__bar detail-skeleton__bar--section" />
      <view v-for="index in 3" :key="index" class="detail-skeleton__platform">
        <view class="detail-skeleton__bar detail-skeleton__bar--line" />
        <view class="detail-skeleton__bar detail-skeleton__bar--track" />
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@keyframes detail-skeleton-pulse {
  50% {
    opacity: 0.5;
  }
}

.detail-skeleton {
  animation: detail-skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.detail-skeleton__hero {
  display: flex;
  padding: 0 $page-gutter 36px;
  background-color: $gray-100;
}

.detail-skeleton__cover {
  flex-shrink: 0;
  width: 112px;
  height: 157px;
  border-radius: 10px;
  background-color: $gray-200;
}

.detail-skeleton__info {
  flex: 1;
  margin-left: 16px;
  padding-top: 8px;
}

.detail-skeleton__bar {
  height: 14px;
  border-radius: 999px;
  background-color: $gray-200;
}

.detail-skeleton__bar + .detail-skeleton__bar {
  margin-top: 12px;
}

.detail-skeleton__bar--title {
  width: 80%;
  height: 22px;
}

.detail-skeleton__bar--line {
  width: 60%;
}

.detail-skeleton__bar--short {
  width: 40%;
}

.detail-skeleton__body {
  margin-top: -16px;
  padding: 20px $page-gutter 0;
  border-radius: 20px 20px 0 0;
  background-color: #fff;
}

.detail-skeleton__stats {
  display: flex;
}

.detail-skeleton__stat {
  width: 96px;
  height: 52px;
  margin-right: 24px;
  border-radius: 12px;
  background-color: $gray-100;
}

.detail-skeleton__bar--section {
  width: 120px;
  height: 18px;
  margin-top: 32px;
}

.detail-skeleton__platform {
  margin-top: 20px;
}

.detail-skeleton__bar--track {
  width: 100%;
  height: 6px;
  margin-top: 10px;
}
</style>
