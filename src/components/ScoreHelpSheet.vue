<script setup lang="ts">
import { openPage } from "@/utils/navigation";
import { routes } from "@/utils/routes";

import BottomSheet from "./BottomSheet.vue";

// 综合评分和人气值的简要说明，详情页的"综合评分"和列表工具栏的"评分说明"共用
defineProps<{ visible: boolean }>();

const emit = defineEmits<{ close: [] }>();

const openMetricArticle = () => {
  emit("close");
  openPage(routes.article("metric"));
};
</script>

<template>
  <BottomSheet :visible="visible" title="综合评分是怎么算的" @close="emit('close')">
    <view class="bottom-sheet__item">
      <view class="bottom-sheet__item-title">统一尺度</view>
      <view class="bottom-sheet__item-text">
        Bangumi、MyAnimeList、AniList 的打分习惯不同，先把每个平台的评分换算成 0–100
        的标准化评分。50 分代表该平台的平均水平。
      </view>
    </view>
    <view class="bottom-sheet__item">
      <view class="bottom-sheet__item-title">加权平均</view>
      <view class="bottom-sheet__item-text">
        各平台的标准化评分按权重加权平均（Bangumi 为 2，其他平台为
        1），得到综合评分。没有评分的平台不参与计算。
      </view>
    </view>
    <view class="bottom-sheet__item">
      <view class="bottom-sheet__item-title">人气值</view>
      <view class="bottom-sheet__item-text">
        各平台的关注人数先按该平台的人气中位数换算，再加权求和。覆盖的平台越多、关注的人越多，人气值越高。
      </view>
    </view>
    <view
      class="bottom-sheet__button"
      hover-class="bottom-sheet__button--active"
      @tap="openMetricArticle"
    >
      查看完整说明
    </view>
  </BottomSheet>
</template>
