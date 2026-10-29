<script setup lang="ts">
import Taro, { useLoad, usePageScroll, useShareAppMessage } from "@tarojs/taro";
import { computed, ref } from "vue";

import AnimeDetailSkeleton from "@/components/AnimeDetailSkeleton.vue";
import AnimeShelf from "@/components/AnimeShelf.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import DetailNavBar from "@/components/DetailNavBar.vue";
import PlatformScoreRow from "@/components/PlatformScoreRow.vue";
import ScoreHelpSheet from "@/components/ScoreHelpSheet.vue";
import { useRequest } from "@/composables/useRequest";
import { GetAnimeDetailDocument, GetAnimeListDocument } from "@/graphql/generated/graphql";
import { request } from "@/graphql/request";
import { formatInteger, getDisplayTitle } from "@/utils/format";
import { getNavBarMetrics, isEntryPage, openPage } from "@/utils/navigation";
import { toPageQuery } from "@/utils/query";
import { routes, type DocName } from "@/utils/routes";
import { formatSeason, getSeasonOfStartDate } from "@/utils/season";

// 头图滚出这么多之后，导航栏切换为白底
const SOLID_NAV_SCROLL_TOP = 120;

const { statusBarHeight, navBarHeight } = getNavBarMetrics();
const navHeight = statusBarHeight + navBarHeight;

const animeId = ref("");
const invalidId = ref(false);
const canGoBack = ref(true);
const scrolled = ref(false);
const sheet = ref<"score" | "platform">();

const {
  data: anime,
  error,
  run,
} = useRequest(async () => {
  const data = await request(GetAnimeDetailDocument, { animeId: Number(animeId.value) });
  return data.anime ?? null;
});

const displayTitle = computed(() => (anime.value ? getDisplayTitle(anime.value.title) : ""));

// 罗马音和英文名经常相同（例如 Steins;Gate），去重后再展示
const subTitles = computed(() => {
  const t = anime.value?.title;
  if (!t) return [];
  const candidates = [t.titleCn ? t.titleNative : null, t.titleRomaji, t.titleEn];
  const titles = candidates.filter(
    (title): title is string => !!title && title !== displayTitle.value,
  );
  return [...new Set(titles)];
});

const animeSeason = computed(() => getSeasonOfStartDate(anime.value?.startDate));

const metaText = computed(() => {
  const parts: string[] = [];
  if (anime.value?.startDate) parts.push(`${anime.value.startDate} 开播`);
  if (animeSeason.value) parts.push(`${formatSeason(animeSeason.value)}季度`);
  return parts.join(" · ");
});

// 没有头图（加载中、出错）时导航栏始终是白底
const navSolid = computed(() => !anime.value || scrolled.value);

// 同季度的其他动画，按评分取前 12 部
const sameSeason = useRequest(async () => {
  const key = animeSeason.value;
  if (!key) return [];
  const data = await request(GetAnimeListDocument, { ...key, sortBy: "SCORE", pageSize: 13 });
  // 接口返回的 animeId 是字符串，统一转成字符串比较
  return data.animeList.content
    .filter((item) => String(item.animeId) !== animeId.value)
    .slice(0, 12);
});

const load = async () => {
  await run();
  if (animeSeason.value) sameSeason.run();
};

const openSheet = (name: "score" | "platform") => {
  sheet.value = name;
};

const closeSheet = () => {
  sheet.value = undefined;
};

const openArticle = (name: DocName) => {
  closeSheet();
  openPage(routes.article(name));
};

const openSeasonList = () => {
  if (animeSeason.value) {
    openPage(routes.list({ filters: { ...animeSeason.value, sortBy: "SCORE" } }));
  }
};

const previewCover = () => {
  if (anime.value?.coverImage) void Taro.previewImage({ urls: [anime.value.coverImage] });
};

useLoad((options) => {
  canGoBack.value = !isEntryPage();
  animeId.value = toPageQuery(options).animeId ?? "";
  invalidId.value = !/^\d+$/.test(animeId.value);
  if (!invalidId.value) load();
});

// 只在跨过阈值时更新，避免滚动时频繁触发渲染
usePageScroll(({ scrollTop }) => {
  const next = scrollTop > SOLID_NAV_SCROLL_TOP;
  if (next !== scrolled.value) scrolled.value = next;
});

useShareAppMessage(() => ({
  title: displayTitle.value ? `${displayTitle.value} - 有希计划` : "有希计划",
  path: routes.anime(animeId.value),
  imageUrl: anime.value?.coverImage ?? undefined,
}));
</script>

<template>
  <DetailNavBar :solid="navSolid" :can-go-back="canGoBack" />

  <view
    v-if="invalidId || anime === null"
    class="anime-page__state"
    :style="{ paddingTop: `${navHeight + 80}px` }"
  >
    未找到该动画
  </view>

  <view
    v-else-if="error && !anime"
    class="anime-page__state anime-page__state--error"
    :style="{ paddingTop: `${navHeight + 80}px` }"
    @tap="load"
  >
    {{ error }}，点击重试
  </view>

  <!-- 首次请求返回前 anime 为 undefined -->
  <AnimeDetailSkeleton v-else-if="!anime" :top-offset="navHeight" />

  <view v-else class="anime-page">
    <view class="anime-page__hero">
      <image
        v-if="anime.coverImage"
        class="anime-page__hero-bg"
        :src="anime.coverImage"
        mode="aspectFill"
      />
      <view class="anime-page__hero-mask" />

      <view class="anime-page__hero-content" :style="{ paddingTop: `${navHeight + 8}px` }">
        <image
          v-if="anime.coverImage"
          class="anime-page__hero-cover"
          :src="anime.coverImage"
          mode="aspectFill"
          @tap="previewCover"
        />
        <view v-else class="anime-page__hero-cover" />

        <view class="anime-page__hero-info">
          <view class="anime-page__hero-title">{{ displayTitle }}</view>
          <view
            v-for="(subTitle, index) in subTitles"
            :key="index"
            class="anime-page__hero-subtitle"
          >
            {{ subTitle }}
          </view>
          <view v-if="metaText" class="anime-page__hero-meta">{{ metaText }}</view>
        </view>
      </view>
    </view>

    <view class="anime-page__body">
      <view class="anime-page__stats">
        <view
          class="anime-page__stat"
          hover-class="anime-page__stat--active"
          @tap="openSheet('score')"
        >
          <view class="anime-page__stat-label">
            <text>综合评分</text>
            <view class="anime-page__help-icon">?</view>
          </view>
          <view v-if="anime.averageScore" class="anime-page__stat-value-row">
            <text class="anime-page__stat-value anime-page__stat-value--score">{{
              anime.averageScore.toFixed(1)
            }}</text>
            <text class="anime-page__stat-unit">/100</text>
          </view>
          <text v-else class="anime-page__stat-empty">暂无</text>
        </view>

        <view class="anime-page__stat">
          <view class="anime-page__stat-label">人气值</view>
          <text
            v-if="anime.popularity"
            class="anime-page__stat-value anime-page__stat-value--popularity"
          >
            {{ formatInteger(anime.popularity) }}
          </text>
          <text v-else class="anime-page__stat-empty">暂无</text>
        </view>

        <button class="anime-page__share" open-type="share" hover-class="anime-page__share--active">
          分享
        </button>
      </view>

      <view v-if="anime.mappings.length > 0" class="anime-page__section">
        <view class="anime-page__section-head">
          <text class="anime-page__section-title">各平台数据</text>
          <view
            class="anime-page__section-help"
            hover-class="anime-page__section-help--active"
            @tap="openSheet('platform')"
          >
            <view class="anime-page__help-icon">?</view>
          </view>
        </view>
        <view
          v-for="mapping in anime.mappings"
          :key="mapping.mappingId"
          class="anime-page__platform"
        >
          <PlatformScoreRow :mapping="mapping" />
        </view>
      </view>

      <view v-if="animeSeason && sameSeason.data.value?.length" class="anime-page__shelf">
        <AnimeShelf
          title="同季度动画"
          :subtitle="formatSeason(animeSeason)"
          :anime-list="sameSeason.data.value"
          @more="openSeasonList"
        />
      </view>
    </view>
  </view>

  <ScoreHelpSheet :visible="sheet === 'score'" @close="closeSheet" />

  <BottomSheet :visible="sheet === 'platform'" title="各平台数据说明" @close="closeSheet">
    <view class="bottom-sheet__item">
      <view class="bottom-sheet__item-title">标准化评分（横条）</view>
      <view class="bottom-sheet__item-text">
        该平台评分换算到 0–100 后的结果，50 分为该平台的平均水平，可以直接跨平台比较。
      </view>
    </view>
    <view class="bottom-sheet__item">
      <view class="bottom-sheet__item-title">原始评分与人气</view>
      <view class="bottom-sheet__item-text">
        原始评分是平台上显示的分数（Bangumi、MyAnimeList 为 10 分制，AniList 为 100
        分制）。原始人气在 AniList 为关注人数，在另外两个平台为评分人数。
      </view>
    </view>
    <view class="bottom-sheet__item">
      <view class="bottom-sheet__item-title">标准化人气</view>
      <view class="bottom-sheet__item-text">
        原始人气按该平台的人气中位数换算后的值，中位数对应 10000。点击某个平台可以复制它的条目链接。
      </view>
    </view>
    <view
      class="bottom-sheet__button"
      hover-class="bottom-sheet__button--active"
      @tap="openArticle('platforms')"
    >
      查看平台参数
    </view>
  </BottomSheet>
</template>

<style lang="scss">
.anime-page__state {
  padding: 0 $page-gutter;
  color: $gray-500;
  font-size: 15px;
  text-align: center;
}

.anime-page__state--error {
  color: $red-600;
}

.anime-page {
  padding-bottom: calc(32px + env(safe-area-inset-bottom));
}

/* 头图：封面放大模糊作为背景，叠一层深色遮罩保证白字可读 */
.anime-page__hero {
  position: relative;
  overflow: hidden;
  background-color: $gray-800;
}

.anime-page__hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: blur(24px);
  transform: scale(1.3);
}

.anime-page__hero-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(rgba(16, 24, 40, 0.45), rgba(16, 24, 40, 0.75));
}

.anime-page__hero-content {
  position: relative;
  display: flex;
  padding: 0 $page-gutter 36px;
}

.anime-page__hero-cover {
  flex-shrink: 0;
  width: 112px;
  height: 157px;
  border-radius: 10px;
  background-color: $gray-700;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.anime-page__hero-info {
  flex: 1;
  min-width: 0;
  margin-left: 16px;
  padding-top: 4px;
}

.anime-page__hero-title {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
}

.anime-page__hero-subtitle {
  margin-top: 6px;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anime-page__hero-meta {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

/* 内容区圆角上移盖住头图底部 */
.anime-page__body {
  position: relative;
  margin-top: -16px;
  padding-top: 20px;
  border-radius: 20px 20px 0 0;
  background-color: #fff;
}

.anime-page__stats {
  display: flex;
  align-items: center;
  padding: 0 $page-gutter;
}

.anime-page__stat {
  margin-right: 20px;
}

.anime-page__stat--active {
  opacity: 0.6;
}

.anime-page__stat-label {
  display: flex;
  align-items: center;
  color: $gray-500;
  font-size: 12px;
  font-weight: 700;
}

.anime-page__help-icon {
  width: 13px;
  height: 13px;
  margin-left: 4px;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 400;
  line-height: 13px;
  text-align: center;
}

.anime-page__stat-value-row {
  display: flex;
  align-items: baseline;
}

.anime-page__stat-value {
  margin-top: 4px;
  font-size: 28px;
  font-weight: 900;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.anime-page__stat-value--score {
  color: $indigo-600;
}

.anime-page__stat-value--popularity {
  color: $pink-500;
}

.anime-page__stat-unit {
  margin-left: 2px;
  color: $gray-400;
  font-size: 14px;
}

.anime-page__stat-empty {
  margin-top: 8px;
  color: $gray-400;
  font-size: 15px;
}

/*
 * 各端给 button 的默认样式带属性选择器，例如 button:not([size="mini"]) 的固定宽度，
 * 优先级比单个类名高，所以这里多加一层类名
 */
.anime-page__stats .anime-page__share {
  flex-shrink: 0;
  width: auto;
  margin: 0 0 0 auto;
  padding: 0 16px;
  border-radius: 16px;
  background-color: $gray-100;
  color: $gray-800;
  font-size: 13px;
  line-height: 32px;
  white-space: nowrap;
}

.anime-page__stats .anime-page__share::after {
  border: none;
}

.anime-page__stats .anime-page__share--active {
  background-color: $gray-200;
}

.anime-page__section {
  margin-top: 28px;
  padding: 0 $page-gutter;
}

.anime-page__section-head {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.anime-page__section-title {
  color: $gray-900;
  font-size: 17px;
  font-weight: 700;
}

.anime-page__section-help {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: $gray-400;
}

.anime-page__section-help--active {
  opacity: 0.6;
}

.anime-page__platform + .anime-page__platform {
  border-top: 1px solid $gray-100;
}

.anime-page__shelf {
  margin-top: 28px;
}
</style>
