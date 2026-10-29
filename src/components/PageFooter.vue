<script setup lang="ts">
import { openPage } from "@/utils/navigation";
import { routes, type DocName } from "@/utils/routes";

const links: { name: DocName; label: string }[] = [
  { name: "about", label: "关于" },
  { name: "metric", label: "评分说明" },
  { name: "platforms", label: "平台参数" },
];

const openDoc = (name: DocName) => {
  openPage(routes.article(name));
};
</script>

<template>
  <view class="footer">
    <view class="nav">
      <view
        v-for="link in links"
        :key="link.name"
        class="link"
        hover-class="link--active"
        @tap="openDoc(link.name)"
      >
        {{ link.label }}
      </view>
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
  margin: 0 6px;
  padding: 4px 6px;
  border-radius: 6px;
}

.link--active {
  background-color: $gray-100;
}

.copyright {
  font-size: 12px;
}
</style>
