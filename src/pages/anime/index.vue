<script setup lang="ts">
import { onLoad, onPageScroll, onShareAppMessage } from "@dcloudio/uni-app";
import { computed, ref } from "vue";

import AnimeDetailSkeleton from "@/components/AnimeDetailSkeleton.vue";
import AnimeShelf from "@/components/AnimeShelf.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import DetailNavBar from "@/components/DetailNavBar.vue";
import PlatformScoreRow from "@/components/PlatformScoreRow.vue";
import { useRequest } from "@/composables/useRequest";
import { GetAnimeDetailDocument, GetAnimeListDocument } from "@/graphql/generated/graphql";
import { request } from "@/graphql/request";
import { formatInteger, getDisplayTitle } from "@/utils/format";
import { getNavBarMetrics, isEntryPage, openPage } from "@/utils/navigation";
import { toPageQuery } from "@/utils/query";
import { routes, type DocName } from "@/utils/routes";
import { formatSeason, getSeasonOfStartDate } from "@/utils/season";

// 头图滚出这么多之后，导航栏切换为白底并显示标题
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
  if (anime.value?.coverImage) uni.previewImage({ urls: [anime.value.coverImage] });
};

onLoad((options) => {
  canGoBack.value = !isEntryPage();
  animeId.value = toPageQuery(options).animeId ?? "";
  invalidId.value = !/^\d+$/.test(animeId.value);
  if (!invalidId.value) load();
});

// 只在跨过阈值时更新，避免滚动时频繁触发渲染
onPageScroll(({ scrollTop }) => {
  const next = scrollTop > SOLID_NAV_SCROLL_TOP;
  if (next !== scrolled.value) scrolled.value = next;
});

onShareAppMessage(() => ({
  title: displayTitle.value ? `${displayTitle.value} - 有希计划` : "有希计划",
  path: routes.anime(animeId.value),
  imageUrl: anime.value?.coverImage ?? undefined,
}));
</script>

<template>
  <DetailNavBar :title="displayTitle" :solid="navSolid" :can-go-back="canGoBack" />

  <view
    v-if="invalidId || anime === null"
    class="state"
    :style="{ paddingTop: `${navHeight + 80}px` }"
  >
    未找到该动画
  </view>

  <view
    v-else-if="error && !anime"
    class="state state--error"
    :style="{ paddingTop: `${navHeight + 80}px` }"
    @tap="load"
  >
    {{ error }}，点击重试
  </view>

  <!-- 首次请求返回前 anime 为 undefined -->
  <AnimeDetailSkeleton v-else-if="!anime" :top-offset="navHeight" />

  <view v-else class="page">
    <view class="hero">
      <image v-if="anime.coverImage" class="hero-bg" :src="anime.coverImage" mode="aspectFill" />
      <view class="hero-mask" />

      <view class="hero-content" :style="{ paddingTop: `${navHeight + 8}px` }">
        <image
          v-if="anime.coverImage"
          class="hero-cover"
          :src="anime.coverImage"
          mode="aspectFill"
          @tap="previewCover"
        />
        <view v-else class="hero-cover" />

        <view class="hero-info">
          <view class="hero-title">{{ displayTitle }}</view>
          <view v-for="(subTitle, index) in subTitles" :key="index" class="hero-subtitle">
            {{ subTitle }}
          </view>
          <view v-if="metaText" class="hero-meta">{{ metaText }}</view>
        </view>
      </view>
    </view>

    <view class="body">
      <view class="stats">
        <view class="stat" hover-class="stat--active" @tap="openSheet('score')">
          <view class="stat-label">
            <text>综合评分</text>
            <view class="help-icon">?</view>
          </view>
          <view v-if="anime.averageScore" class="stat-value-row">
            <text class="stat-value stat-value--score">{{ anime.averageScore.toFixed(1) }}</text>
            <text class="stat-unit">/100</text>
          </view>
          <text v-else class="stat-empty">暂无</text>
        </view>

        <view class="stat">
          <view class="stat-label">人气值</view>
          <text v-if="anime.popularity" class="stat-value stat-value--popularity">
            {{ formatInteger(anime.popularity) }}
          </text>
          <text v-else class="stat-empty">暂无</text>
        </view>

        <button class="share" open-type="share" hover-class="share--active">分享</button>
      </view>

      <view v-if="anime.mappings.length > 0" class="section">
        <view class="section-head">
          <text class="section-title">各平台数据</text>
          <view
            class="section-help"
            hover-class="section-help--active"
            @tap="openSheet('platform')"
          >
            <view class="help-icon">?</view>
          </view>
        </view>
        <view v-for="mapping in anime.mappings" :key="mapping.mappingId" class="platform">
          <PlatformScoreRow :mapping="mapping" />
        </view>
      </view>

      <view v-if="animeSeason && sameSeason.data.value?.length" class="shelf">
        <AnimeShelf
          title="同季度动画"
          :subtitle="formatSeason(animeSeason)"
          :anime-list="sameSeason.data.value"
          @more="openSeasonList"
        />
      </view>
    </view>
  </view>

  <BottomSheet :visible="sheet === 'score'" title="综合评分是怎么算的" @close="closeSheet">
    <view class="sheet-item">
      <view class="sheet-item-title">统一尺度</view>
      <view class="sheet-item-text">
        Bangumi、MyAnimeList、AniList 的打分习惯不同，先把每个平台的评分换算成 0–100
        的标准化评分。50 分代表该平台的平均水平。
      </view>
    </view>
    <view class="sheet-item">
      <view class="sheet-item-title">加权平均</view>
      <view class="sheet-item-text">
        各平台的标准化评分按权重加权平均（Bangumi 为 2，其他平台为
        1），得到综合评分。没有评分的平台不参与计算。
      </view>
    </view>
    <view class="sheet-item">
      <view class="sheet-item-title">人气值</view>
      <view class="sheet-item-text">
        各平台的关注人数先按该平台的人气中位数换算，再加权求和。覆盖的平台越多、关注的人越多，人气值越高。
      </view>
    </view>
    <view class="sheet-button" hover-class="sheet-button--active" @tap="openArticle('metric')">
      查看完整说明
    </view>
  </BottomSheet>

  <BottomSheet :visible="sheet === 'platform'" title="各平台数据说明" @close="closeSheet">
    <view class="sheet-item">
      <view class="sheet-item-title">标准化评分（横条）</view>
      <view class="sheet-item-text">
        该平台评分换算到 0–100 后的结果，50 分为该平台的平均水平，可以直接跨平台比较。
      </view>
    </view>
    <view class="sheet-item">
      <view class="sheet-item-title">原始评分与人气</view>
      <view class="sheet-item-text">
        原始评分是平台上显示的分数（Bangumi、MyAnimeList 为 10 分制，AniList 为 100
        分制）。原始人气在 AniList 为关注人数，在另外两个平台为评分人数。
      </view>
    </view>
    <view class="sheet-item">
      <view class="sheet-item-title">标准化人气</view>
      <view class="sheet-item-text">
        原始人气按该平台的人气中位数换算后的值，中位数对应 10000。点击某个平台可以复制它的条目链接。
      </view>
    </view>
    <view class="sheet-button" hover-class="sheet-button--active" @tap="openArticle('platforms')">
      查看平台参数
    </view>
  </BottomSheet>
</template>

<style lang="scss" scoped>
.state {
  padding: 0 $page-gutter;
  color: $gray-500;
  font-size: 15px;
  text-align: center;
}

.state--error {
  color: $red-600;
}

.page {
  padding-bottom: calc(32px + env(safe-area-inset-bottom));
}

/* 头图：封面放大模糊作为背景，叠一层深色遮罩保证白字可读 */
.hero {
  position: relative;
  overflow: hidden;
  background-color: $gray-800;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: blur(24px);
  transform: scale(1.3);
}

.hero-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(rgba(16, 24, 40, 0.45), rgba(16, 24, 40, 0.75));
}

.hero-content {
  position: relative;
  display: flex;
  padding: 0 $page-gutter 36px;
}

.hero-cover {
  flex-shrink: 0;
  width: 112px;
  height: 157px;
  border-radius: 10px;
  background-color: $gray-700;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.hero-info {
  flex: 1;
  min-width: 0;
  margin-left: 16px;
  padding-top: 4px;
}

.hero-title {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
}

.hero-subtitle {
  margin-top: 6px;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-meta {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

/* 内容区圆角上移盖住头图底部 */
.body {
  position: relative;
  margin-top: -16px;
  padding-top: 20px;
  border-radius: 20px 20px 0 0;
  background-color: #fff;
}

.stats {
  display: flex;
  align-items: center;
  padding: 0 $page-gutter;
}

.stat {
  margin-right: 20px;
}

.stat--active {
  opacity: 0.6;
}

.stat-label {
  display: flex;
  align-items: center;
  color: $gray-500;
  font-size: 12px;
  font-weight: 700;
}

.help-icon {
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

.stat-value-row {
  display: flex;
  align-items: baseline;
}

.stat-value {
  margin-top: 4px;
  font-size: 28px;
  font-weight: 900;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.stat-value--score {
  color: $indigo-600;
}

.stat-value--popularity {
  color: $pink-500;
}

.stat-unit {
  margin-left: 2px;
  color: $gray-400;
  font-size: 14px;
}

.stat-empty {
  margin-top: 8px;
  color: $gray-400;
  font-size: 15px;
}

.share {
  flex-shrink: 0;
  margin: 0 0 0 auto;
  padding: 0 16px;
  border-radius: 16px;
  background-color: $gray-100;
  color: $gray-800;
  font-size: 13px;
  line-height: 32px;
  white-space: nowrap;
}

.share::after {
  border: none;
}

.share--active {
  background-color: $gray-200;
}

.section {
  margin-top: 28px;
  padding: 0 $page-gutter;
}

.section-head {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.section-title {
  color: $gray-900;
  font-size: 17px;
  font-weight: 700;
}

.section-help {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: $gray-400;
}

.section-help--active {
  opacity: 0.6;
}

.platform + .platform {
  border-top: 1px solid $gray-100;
}

.shelf {
  margin-top: 28px;
}

.sheet-item + .sheet-item {
  margin-top: 16px;
}

.sheet-item-title {
  color: $gray-900;
  font-size: 15px;
  font-weight: 600;
}

.sheet-item-text {
  margin-top: 4px;
  color: $gray-600;
  font-size: 14px;
  line-height: 1.6;
}

.sheet-button {
  margin-top: 24px;
  border-radius: 12px;
  background-color: $gray-900;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 44px;
  text-align: center;
}

.sheet-button--active {
  background-color: $gray-700;
}
</style>
