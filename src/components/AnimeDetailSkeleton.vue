<template>
  <view class="skeleton">
    <view class="cover" />
    <view class="bar bar--title" />
    <view class="bar bar--line" />
    <view class="bar bar--line bar--short" />
    <view class="stats">
      <view class="stat" />
      <view class="stat" />
    </view>

    <view class="section-title" />
    <view v-for="index in 3" :key="index" class="card">
      <view class="bar bar--card-title" />
      <view class="bar bar--card-score" />
      <view class="bar bar--card-line" />
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px $page-gutter 0;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.cover {
  width: 220px;
  height: 308px;
  border-radius: 16px;
  background-color: $gray-200;
}

.bar {
  border-radius: 999px;
  background-color: $gray-200;
}

.bar--title {
  width: 70%;
  height: 28px;
  margin-top: 24px;
}

.bar--line {
  width: 60%;
  height: 14px;
  margin-top: 12px;
}

.bar--short {
  width: 40%;
}

.stats {
  display: flex;
  margin-top: 20px;
}

.stat {
  width: 96px;
  height: 48px;
  margin: 0 12px;
  border-radius: 12px;
  background-color: $gray-200;
}

.section-title {
  align-self: stretch;
  width: 120px;
  height: 22px;
  margin-top: 40px;
  border-radius: 999px;
  background-color: $gray-200;
}

.card {
  align-self: stretch;
  margin-top: 16px;
  padding: 18px;
  border: 1px solid $gray-100;
  border-radius: 16px;
}

.bar--card-title {
  width: 120px;
  height: 16px;
}

.bar--card-score {
  width: 140px;
  height: 22px;
  margin-top: 12px;
}

.bar--card-line {
  width: 70%;
  height: 14px;
  margin-top: 12px;
}
</style>
