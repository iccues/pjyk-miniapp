<script setup lang="ts">
import Taro, { useLoad, useShareAppMessage } from "@tarojs/taro";
import { computed, ref } from "vue";

import NavBar from "@/components/NavBar.vue";
import about from "@/docs/about.md";
import metric from "@/docs/metric.md";
import platforms from "@/docs/platforms.md";
import { toPageQuery } from "@/utils/query";
import { routes, type DocName } from "@/utils/routes";

const DOCS: Record<DocName, { label: string; title: string; nodes: Record<string, unknown>[] }> = {
  about: { label: "关于", title: "关于有希计划", nodes: about },
  metric: { label: "评分说明", title: "评分与热度说明", nodes: metric },
  platforms: { label: "平台参数", title: "平台数据参数", nodes: platforms },
};

const DOC_NAMES = Object.keys(DOCS) as DocName[];

const current = ref<DocName>("about");
const doc = computed(() => DOCS[current.value]);

// 文档之间互相切换时替换当前页，避免页面栈越叠越深
const switchDoc = (name: DocName) => {
  if (name !== current.value) void Taro.redirectTo({ url: routes.article(name) });
};

useLoad((options) => {
  const name = toPageQuery(options).name as DocName;
  if (DOC_NAMES.includes(name)) current.value = name;
});

useShareAppMessage(() => ({
  title: `${doc.value.title} - 有希计划`,
  path: routes.article(current.value),
}));
</script>

<template>
  <NavBar />

  <view class="article-page">
    <rich-text :nodes="doc.nodes" />

    <view class="article-page__nav">
      <view
        v-for="name in DOC_NAMES"
        :key="name"
        class="article-page__nav-item"
        :class="{ 'article-page__nav-item--active': name === current }"
        @tap="switchDoc(name)"
      >
        {{ DOCS[name].label }}
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.article-page {
  padding: 24px $page-gutter 40px;
}

.article-page__nav {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid $gray-200;
}

.article-page__nav-item {
  margin: 0 6px;
  padding: 6px 12px;
  border-radius: 8px;
  color: $gray-600;
  font-size: 14px;
}

.article-page__nav-item--active {
  background-color: $gray-100;
  color: $gray-900;
  font-weight: 600;
}
</style>
