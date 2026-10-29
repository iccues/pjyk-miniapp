<script setup lang="ts">
import { onLoad, onPullDownRefresh, onShareAppMessage } from "@dcloudio/uni-app";
import { computed, ref } from "vue";

import AnimeShelf from "@/components/AnimeShelf.vue";
import PageFooter from "@/components/PageFooter.vue";
import SearchBar from "@/components/SearchBar.vue";
import { useRequest } from "@/composables/useRequest";
import { GetHomeAnimeRowsDocument, type AnimeCardFragment } from "@/graphql/generated/graphql";
import { request } from "@/graphql/request";
import type { AnimeListFilters } from "@/utils/filters";
import { openPage } from "@/utils/navigation";
import { setPendingSearch } from "@/utils/pending-search";
import { routes, TAB_PAGES, type DocName } from "@/utils/routes";
import { formatSeason, getCurrentSeason, getDefaultRankingYear } from "@/utils/season";

const current = getCurrentSeason();
const yearlyBestYear = getDefaultRankingYear();
const seasonName = formatSeason(current);

const { data, loading, error, run } = useRequest(() =>
  request(GetHomeAnimeRowsDocument, {
    currentYear: current.year,
    currentSeason: current.season,
    yearlyBestYear,
  }),
);

// 每一行的"查看全部"打开列表页，筛选条件与这一行一致
const rows = computed(() => {
  const rowsData = data.value;
  const items: {
    key: string;
    title: string;
    filters: AnimeListFilters;
    animeList?: AnimeCardFragment[];
  }[] = [
    {
      key: "seasonBest",
      title: `${seasonName}最佳`,
      filters: { ...current, sortBy: "SCORE" },
      animeList: rowsData?.seasonBest.content,
    },
    {
      key: "seasonPopular",
      title: `${seasonName}最热`,
      filters: { ...current, sortBy: "POPULARITY" },
      animeList: rowsData?.seasonPopular.content,
    },
    {
      key: "yearlyBest",
      title: `${yearlyBestYear}年度最佳`,
      filters: { year: yearlyBestYear, sortBy: "SCORE" },
      animeList: rowsData?.yearlyBest.content,
    },
    {
      key: "allTimeBest",
      title: "历史最佳",
      filters: { sortBy: "SCORE" },
      animeList: rowsData?.allTimeBest.content,
    },
  ];
  return items;
});

const keyword = ref("");

// 搜索在单独的标签页里完成；switchTab 不能带参数，关键词先暂存再切过去
const search = () => {
  const q = keyword.value.trim();
  if (!q) return;
  setPendingSearch(q);
  keyword.value = "";
  uni.switchTab({ url: TAB_PAGES.search });
};

const openList = (filters: AnimeListFilters) => {
  openPage(routes.list({ filters }));
};

const openAllAnime = () => openList({ sortBy: "SCORE" });

const openDoc = (name: DocName) => {
  openPage(routes.article(name));
};

onLoad(() => {
  run();
});

onPullDownRefresh(async () => {
  await run();
  uni.stopPullDownRefresh();
});

onShareAppMessage(() => ({
  title: "有希计划 - 更全面的动画评分",
  path: routes.home(),
}));
</script>

<template>
  <view class="hero">
    <view class="hero-title">更全面的动画评分</view>
    <view class="hero-description">
      有希计划整合 Bangumi、MyAnimeList、AniList 的评分与热度数据，归一化后给出统一的综合评价。
    </view>

    <view class="hero-search">
      <SearchBar v-model="keyword" show-button @confirm="search" />
    </view>

    <view class="quick-links">
      <view class="quick-link" hover-class="quick-link--active" @tap="openAllAnime">
        全部动画
      </view>
      <view class="quick-link" hover-class="quick-link--active" @tap="openDoc('metric')">
        评分说明
      </view>
    </view>
  </view>

  <view v-if="error && !data" class="error" @tap="run">{{ error }}，点击重试</view>

  <view v-else class="rows">
    <view v-for="row in rows" :key="row.key" class="row">
      <AnimeShelf
        :title="row.title"
        :anime-list="row.animeList"
        :loading="loading || !data"
        @more="openList(row.filters)"
      />
    </view>
  </view>

  <PageFooter />
</template>

<style lang="scss" scoped>
.hero {
  padding: 32px $page-gutter 8px;
  text-align: center;
}

.hero-title {
  color: $gray-900;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.25;
}

.hero-description {
  margin-top: 12px;
  color: $gray-600;
  font-size: 15px;
  line-height: 1.65;
}

.hero-search {
  margin-top: 24px;
  text-align: left;
}

.quick-links {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.quick-link {
  margin: 0 2px;
  padding: 6px 12px;
  border-radius: 8px;
  color: $gray-600;
  font-size: 14px;
  font-weight: 500;
}

.quick-link--active {
  background-color: $gray-200;
}

.rows {
  padding-top: 20px;
}

.row + .row {
  margin-top: 32px;
}

.error {
  padding: 40px $page-gutter;
  color: $red-600;
  font-size: 15px;
  text-align: center;
}
</style>
