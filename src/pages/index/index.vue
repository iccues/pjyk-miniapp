<script setup lang="ts">
import { onLoad, onPullDownRefresh, onShareAppMessage } from "@dcloudio/uni-app";
import { computed, ref } from "vue";

import AnimeRow from "@/components/AnimeRow.vue";
import PageFooter from "@/components/PageFooter.vue";
import SearchBar from "@/components/SearchBar.vue";
import { useRequest } from "@/composables/useRequest";
import { SEASON_NAME_MAP } from "@/constants/ui-options";
import { GetHomeAnimeRowsDocument } from "@/graphql/generated/graphql";
import { request } from "@/graphql/request";
import { getSeasonOfMonth } from "@/utils/filters";
import { routes, type DocName } from "@/utils/routes";

const now = new Date();
const currentYear = now.getFullYear();
const currentSeason = getSeasonOfMonth(now.getMonth() + 1);
// 1 月季度刚开始时当年数据太少，年度最佳展示上一年
const yearlyBestYear = currentSeason === "WINTER" ? currentYear - 1 : currentYear;
const seasonName = `${currentYear}年${SEASON_NAME_MAP[currentSeason]}`;

const { data, loading, error, run } = useRequest(() =>
  request(GetHomeAnimeRowsDocument, { currentYear, currentSeason, yearlyBestYear }),
);

const rows = computed(() => [
  {
    key: "seasonBest",
    title: `${seasonName}最佳`,
    moreUrl: routes.animeList({ year: currentYear, season: currentSeason }),
    animeList: data.value?.seasonBest.content,
  },
  {
    key: "seasonPopular",
    title: `${seasonName}最热`,
    moreUrl: routes.animeList({ year: currentYear, season: currentSeason, sortBy: "POPULARITY" }),
    animeList: data.value?.seasonPopular.content,
  },
  {
    key: "yearlyBest",
    title: `${yearlyBestYear}年度最佳`,
    moreUrl: routes.animeList({ year: yearlyBestYear }),
    animeList: data.value?.yearlyBest.content,
  },
  {
    key: "allTimeBest",
    title: "历史最佳",
    moreUrl: routes.animeList(),
    animeList: data.value?.allTimeBest.content,
  },
]);

const keyword = ref("");

const search = () => {
  const q = keyword.value.trim();
  // 空关键词不提交
  if (!q) return;
  uni.navigateTo({ url: routes.search(q) });
};

const openAnimeList = () => uni.navigateTo({ url: routes.animeList() });
const openDoc = (name: DocName) => uni.navigateTo({ url: routes.docs(name) });

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
      <SearchBar v-model="keyword" @submit="search" />
    </view>

    <view class="quick-links">
      <view class="quick-link" hover-class="quick-link--active" @tap="openAnimeList">全部动画</view>
      <view class="quick-link" hover-class="quick-link--active" @tap="openDoc('metric')">
        评分说明
      </view>
    </view>
  </view>

  <view v-if="error && !data" class="error" @tap="run">{{ error }}，点击重试</view>

  <view v-else class="rows">
    <view v-for="row in rows" :key="row.key" class="row">
      <AnimeRow
        :title="row.title"
        :more-url="row.moreUrl"
        :anime-list="row.animeList"
        :loading="loading || !data"
      />
    </view>
  </view>

  <PageFooter />
</template>

<style lang="scss" scoped>
.hero {
  padding: 40px $page-gutter 8px;
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
  margin-top: 28px;
}

.quick-links {
  display: flex;
  justify-content: center;
  margin-top: 16px;
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
  padding-top: 24px;
}

.row + .row {
  margin-top: 40px;
}

.error {
  padding: 40px $page-gutter;
  color: $red-600;
  font-size: 15px;
  text-align: center;
}
</style>
