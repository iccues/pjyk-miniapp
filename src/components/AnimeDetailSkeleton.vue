<script setup lang="ts">
// 与详情页头图区域对齐，topOffset 为自定义导航栏的总高度
defineProps<{ topOffset: number }>();
</script>

<template>
  <view class="skeleton">
    <view class="hero" :style="{ paddingTop: `${topOffset + 8}px` }">
      <view class="cover" />
      <view class="info">
        <view class="bar bar--title" />
        <view class="bar bar--line" />
        <view class="bar bar--short" />
      </view>
    </view>

    <view class="body">
      <view class="stats">
        <view class="stat" />
        <view class="stat" />
      </view>
      <view class="bar bar--section" />
      <view v-for="index in 3" :key="index" class="platform">
        <view class="bar bar--line" />
        <view class="bar bar--track" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

.skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.hero {
  display: flex;
  padding: 0 $page-gutter 36px;
  background-color: $gray-100;
}

.cover {
  flex-shrink: 0;
  width: 112px;
  height: 157px;
  border-radius: 10px;
  background-color: $gray-200;
}

.info {
  flex: 1;
  margin-left: 16px;
  padding-top: 8px;
}

.bar {
  height: 14px;
  border-radius: 999px;
  background-color: $gray-200;
}

.bar + .bar {
  margin-top: 12px;
}

.bar--title {
  width: 80%;
  height: 22px;
}

.bar--line {
  width: 60%;
}

.bar--short {
  width: 40%;
}

.body {
  margin-top: -16px;
  padding: 20px $page-gutter 0;
  border-radius: 20px 20px 0 0;
  background-color: #fff;
}

.stats {
  display: flex;
}

.stat {
  width: 96px;
  height: 52px;
  margin-right: 24px;
  border-radius: 12px;
  background-color: $gray-100;
}

.bar--section {
  width: 120px;
  height: 18px;
  margin-top: 32px;
}

.platform {
  margin-top: 20px;
}

.bar--track {
  width: 100%;
  height: 6px;
  margin-top: 10px;
}
</style>
