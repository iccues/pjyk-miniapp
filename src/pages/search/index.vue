<script setup lang="ts">
import { onLoad, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { ref } from "vue";

import AnimeGrid from "@/components/AnimeGrid.vue";
import SearchBar from "@/components/SearchBar.vue";
import { usePagedAnimeList } from "@/composables/usePagedAnimeList";
import { PAGE_SIZE } from "@/constants/ui-options";
import { GetAnimeListBySearchDocument } from "@/graphql/generated/graphql";
import { request } from "@/graphql/request";
import { decodeQueryValue } from "@/utils/filters";
import { routes } from "@/utils/routes";

// input 是输入框内容，keyword 是已提交的搜索词
const input = ref("");
const keyword = ref("");

const { items, total, loading, finished, error, clear, reset, loadMore, retry } = usePagedAnimeList(
  async (pageNumber) => {
    const data = await request(GetAnimeListBySearchDocument, {
      keyword: keyword.value,
      pageNumber,
      pageSize: PAGE_SIZE,
    });
    return data.animeListBySearch;
  },
);

const search = (value: string) => {
  keyword.value = value;
  // 空关键词时清空结果并显示搜索提示
  if (value) {
    reset();
  } else {
    clear();
  }
};

const submit = () => {
  search(input.value.trim());
  uni.pageScrollTo({ scrollTop: 0, duration: 0 });
};

onLoad((query) => {
  const q = decodeQueryValue((query as Record<string, string> | undefined)?.q).trim();
  input.value = q;
  search(q);
});

onReachBottom(() => {
  if (keyword.value) loadMore();
});

onShareAppMessage(() => ({
  title: keyword.value ? `${keyword.value} - 搜索结果 - 有希计划` : "搜索动画 - 有希计划",
  path: routes.search(keyword.value),
}));
</script>

<template>
  <view class="page">
    <SearchBar v-model="input" :focus="!keyword" @submit="submit" />

    <view v-if="!keyword" class="hint">输入关键词开始搜索</view>

    <view v-else class="results">
      <AnimeGrid
        :items="items"
        :total="total"
        :loading="loading"
        :finished="finished"
        :error="error"
        @retry="retry"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px $page-gutter 0;
}

.hint {
  padding: 40px 0;
  color: $gray-600;
  font-size: 15px;
  text-align: center;
}

.results {
  margin-top: 24px;
}
</style>
