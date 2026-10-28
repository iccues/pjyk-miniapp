<script setup lang="ts">
import { routes, type DocName } from "@/utils/routes";

const links: { name: DocName; label: string }[] = [
  { name: "about", label: "关于" },
  { name: "metric", label: "评分说明" },
  { name: "platforms", label: "平台参数" },
];

const openDoc = (name: DocName) => {
  uni.navigateTo({ url: routes.docs(name) });
};
</script>

<template>
  <view class="footer">
    <view class="nav">
      <text v-for="link in links" :key="link.name" class="link" @tap="openDoc(link.name)">
        {{ link.label }}
      </text>
    </view>
    <view class="copyright">&copy; 2026 Project Yuki. All rights reserved.</view>
  </view>
</template>

<style lang="scss" scoped>
.footer {
  padding: 32px 0;
  color: $gray-500;
  font-size: 14px;
  text-align: center;
}

.nav {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.link {
  margin: 0 12px;
}

.copyright {
  font-size: 12px;
}
</style>
