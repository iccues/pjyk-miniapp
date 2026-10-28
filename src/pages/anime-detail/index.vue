<script setup lang="ts">
import { onLoad, onPullDownRefresh, onShareAppMessage } from "@dcloudio/uni-app";
import { computed, ref, watch } from "vue";

import AnimeDetailSkeleton from "@/components/AnimeDetailSkeleton.vue";
import AnimeHero from "@/components/AnimeHero.vue";
import PlatformCard from "@/components/PlatformCard.vue";
import { useRequest } from "@/composables/useRequest";
import { GetAnimeDetailDocument } from "@/graphql/generated/graphql";
import { request } from "@/graphql/request";
import { getDisplayTitle } from "@/utils/format";
import { routes } from "@/utils/routes";

const animeId = ref(0);

const {
  data: anime,
  error,
  run,
} = useRequest(async () => {
  const data = await request(GetAnimeDetailDocument, { animeId: animeId.value });
  return data.anime ?? null;
});

const displayTitle = computed(() => (anime.value ? getDisplayTitle(anime.value.title) : ""));

watch(displayTitle, (title) => {
  if (title) uni.setNavigationBarTitle({ title });
});

onLoad((query) => {
  animeId.value = Number((query as Record<string, string> | undefined)?.animeId);
  run();
});

onPullDownRefresh(async () => {
  await run();
  uni.stopPullDownRefresh();
});

onShareAppMessage(() => ({
  title: displayTitle.value ? `${displayTitle.value} - 有希计划` : "有希计划",
  path: routes.animeDetail(animeId.value),
  imageUrl: anime.value?.coverImage ?? undefined,
}));
</script>

<template>
  <!-- 首次请求返回前 anime 为 undefined，查无此动画时为 null -->
  <AnimeDetailSkeleton v-if="anime === undefined && !error" />

  <view v-else-if="error && !anime" class="state state--error" @tap="run">
    {{ error }}，点击重试
  </view>

  <view v-else-if="!anime" class="state">未找到该动画</view>

  <view v-else class="page">
    <AnimeHero :anime="anime" />

    <view v-if="anime.mappings.length > 0" class="platforms">
      <view class="section-title">各平台数据</view>
      <view v-for="mapping in anime.mappings" :key="mapping.mappingId" class="platform">
        <PlatformCard :mapping="mapping" />
      </view>
      <view class="note">点击卡片可复制对应平台的条目链接</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  padding-bottom: 40px;
}

.state {
  padding: 80px $page-gutter;
  color: $gray-500;
  font-size: 15px;
  text-align: center;
}

.state--error {
  color: $red-600;
}

.platforms {
  padding: 40px $page-gutter 0;
}

.section-title {
  margin-bottom: 16px;
  color: $gray-800;
  font-size: 18px;
  font-weight: 600;
}

.platform + .platform {
  margin-top: 12px;
}

.note {
  margin-top: 16px;
  color: $gray-400;
  font-size: 12px;
  text-align: center;
}
</style>
