<script setup lang="ts">
import Taro, {
  useDidHide,
  useDidShow,
  useLoad,
  useReachBottom,
  useShareAppMessage,
} from "@tarojs/taro";
import { computed, ref, watch } from "vue";

import AnimeCard from "@/components/AnimeCard.vue";
import AnimeCardSkeleton from "@/components/AnimeCardSkeleton.vue";
import AnimeList from "@/components/AnimeList.vue";
import ListToolbar from "@/components/ListToolbar.vue";
import SearchBar from "@/components/SearchBar.vue";
import { usePagedAnimeList } from "@/composables/usePagedAnimeList";
import { useRequest } from "@/composables/useRequest";
import { PAGE_SIZE, type ListLayout } from "@/constants/ui-options";
import { GetAnimeListBySearchDocument, GetAnimeListDocument } from "@/graphql/generated/graphql";
import { request } from "@/graphql/request";
import { openPage } from "@/utils/navigation";
import { decodeQueryValue, parseLayout, toPageQuery } from "@/utils/query";
import { routes, type DocName } from "@/utils/routes";
import {
  formatSeason,
  getCurrentSeason,
  listSeasonsBackward,
  type SeasonKey,
} from "@/utils/season";

// 停止输入后等多久再发起搜索，避免每敲一个字就请求一次
const SEARCH_DELAY = 300;

// input 是输入框内容，keyword 是已经发起搜索的关键词
const input = ref("");
const keyword = ref("");
const focused = ref(false);
const layout = ref<ListLayout>("row");

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

const scrollToTop = () => void Taro.pageScrollTo({ scrollTop: 0, duration: 0 });

const search = (value: string) => {
  if (value === keyword.value) return;
  keyword.value = value;
  if (value) {
    reset();
  } else {
    clear();
  }
  scrollToTop();
};

let timer: ReturnType<typeof setTimeout> | undefined;

watch(input, (value) => {
  clearTimeout(timer);
  const trimmed = value.trim();
  // 清空时立即回到探索内容，输入时等停顿后再搜
  if (trimmed) {
    timer = setTimeout(() => search(trimmed), SEARCH_DELAY);
  } else {
    search("");
  }
});

// 点键盘上的"搜索"：立即搜索并收起键盘
const searchNow = () => {
  clearTimeout(timer);
  search(input.value.trim());
  focused.value = false;
};

const changeLayout = (value: ListLayout) => {
  layout.value = value;
  scrollToTop();
};

const summary = computed(() =>
  loading.value && items.value.length === 0 ? "搜索中…" : `找到 ${total.value} 部`,
);

// 没有输入时的探索内容：本季热门、按季度浏览、文档入口
const currentSeason = getCurrentSeason();

const hot = useRequest(async () => {
  const data = await request(GetAnimeListDocument, {
    ...currentSeason,
    sortBy: "POPULARITY",
    pageSize: 6,
  });
  return data.animeList.content;
});

const browseSeasons = listSeasonsBackward(currentSeason, 8).map((key) => ({
  id: `${key.year}-${key.season}`,
  key,
  label: formatSeason(key),
}));

const DOC_LINKS: { name: DocName; label: string }[] = [
  { name: "about", label: "关于有希计划" },
  { name: "metric", label: "评分说明" },
  { name: "platforms", label: "平台参数" },
];

const openSeason = (key: SeasonKey) => {
  openPage(routes.list({ filters: { ...key, sortBy: "SCORE" } }));
};

const openDoc = (name: DocName) => {
  openPage(routes.article(name));
};

useLoad((options) => {
  const query = toPageQuery(options);
  layout.value = parseLayout(query.layout) ?? layout.value;

  // 从分享卡片打开时直接显示搜索结果
  const q = decodeQueryValue(query.q).trim();
  if (q) {
    input.value = q;
    search(q);
  }

  hot.run();
});

// 切到搜索页且还没有搜索词时，直接弹出键盘
useDidShow(() => {
  if (!keyword.value) focused.value = true;
});

useDidHide(() => {
  focused.value = false;
});

useReachBottom(() => {
  if (keyword.value) loadMore();
});

useShareAppMessage(() => ({
  title: keyword.value ? `搜索"${keyword.value}" - 有希计划` : "有希计划 - 更全面的动画评分",
  path: routes.search({ keyword: keyword.value, layout: layout.value }),
}));
</script>

<template>
  <view class="search-page__header">
    <SearchBar v-model="input" v-model:focused="focused" @confirm="searchNow" />
  </view>

  <view v-if="!keyword" class="search-page__explore">
    <view class="search-page__section">
      <view class="search-page__section-title">
        <text>本季热门</text>
        <text class="search-page__section-subtitle">{{ formatSeason(currentSeason) }}</text>
      </view>

      <view v-if="hot.error.value && !hot.data.value" class="search-page__hot-error" @tap="hot.run">
        {{ hot.error.value }}，点击重试
      </view>
      <view v-else class="search-page__hot-grid">
        <template v-if="hot.data.value">
          <view v-for="anime in hot.data.value" :key="anime.animeId">
            <AnimeCard :anime="anime" />
          </view>
        </template>
        <template v-else>
          <view v-for="index in 6" :key="index">
            <AnimeCardSkeleton />
          </view>
        </template>
      </view>
    </view>

    <view class="search-page__section">
      <view class="search-page__section-title">按季度浏览</view>
      <view class="search-page__chips">
        <view
          v-for="item in browseSeasons"
          :key="item.id"
          class="search-page__chip"
          hover-class="search-page__chip--active"
          @tap="openSeason(item.key)"
        >
          {{ item.label }}
        </view>
      </view>
    </view>

    <view class="search-page__links">
      <view
        v-for="link in DOC_LINKS"
        :key="link.name"
        class="search-page__link"
        hover-class="search-page__link--active"
        @tap="openDoc(link.name)"
      >
        {{ link.label }}
      </view>
    </view>
  </view>

  <view v-else class="search-page__results">
    <ListToolbar :summary="summary" :layout="layout" @update:layout="changeLayout" />
    <AnimeList
      :items="items"
      :layout="layout"
      :total="total"
      :loading="loading"
      :finished="finished"
      :error="error"
      empty-text="没有找到相关动画"
      @retry="retry"
    />
  </view>
</template>

<style lang="scss">
.search-page__header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 8px $page-gutter;
  background-color: #fff;
}

.search-page__explore {
  padding: 8px $page-gutter 32px;
}

.search-page__section + .search-page__section {
  margin-top: 28px;
}

.search-page__section-title {
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
  color: $gray-900;
  font-size: 17px;
  font-weight: 700;
}

.search-page__section-subtitle {
  margin-left: 8px;
  color: $gray-400;
  font-size: 13px;
  font-weight: 400;
}

.search-page__hot-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 10px;
  row-gap: 16px;
}

.search-page__hot-error {
  padding: 24px 0;
  color: $red-600;
  font-size: 14px;
  text-align: center;
}

.search-page__chips {
  display: flex;
  flex-wrap: wrap;
  margin: -4px;
}

.search-page__chip {
  margin: 4px;
  padding: 7px 14px;
  border-radius: 16px;
  background-color: $gray-100;
  color: $gray-700;
  font-size: 14px;
}

.search-page__chip--active {
  background-color: $gray-200;
}

.search-page__links {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.search-page__link {
  margin: 0 4px;
  padding: 4px 8px;
  border-radius: 6px;
  color: $gray-400;
  font-size: 13px;
}

.search-page__link--active {
  background-color: $gray-100;
}

.search-page__results {
  padding: 0 $page-gutter;
}
</style>
