<script setup lang="ts">
import { generateYearOptionsFrom, SEASON_OPTIONS, SORT_BY_OPTIONS } from "@/constants/ui-options";
import type { Season, SortBy } from "@/graphql/generated/graphql";
import type { AnimeListFilters } from "@/utils/filters";

import PickerFilter from "./PickerFilter.vue";
import SegmentedFilter from "./SegmentedFilter.vue";

defineProps<{
  filters: AnimeListFilters;
}>();

const emit = defineEmits<{ change: [changes: Partial<AnimeListFilters>] }>();

const yearOptions = generateYearOptionsFrom(1990);

const changeYear = (year: number | undefined) => emit("change", { year });
const changeSeason = (season: Season | undefined) => emit("change", { season });
const changeSortBy = (sortBy: SortBy) => emit("change", { sortBy });
</script>

<template>
  <!-- 窄屏下年份和排序放在第一行，季度选项较多单独一行 -->
  <view class="anime-filter">
    <view class="item">
      <PickerFilter
        label="年份"
        :options="yearOptions"
        :value="filters.year ?? undefined"
        @change="changeYear"
      />
    </view>
    <view class="item">
      <SegmentedFilter
        label="排序"
        :options="SORT_BY_OPTIONS"
        :value="filters.sortBy ?? 'SCORE'"
        @change="changeSortBy"
      />
    </view>
    <view class="item">
      <SegmentedFilter
        label="季度"
        :options="SEASON_OPTIONS"
        :value="filters.season ?? undefined"
        :disabled="filters.year == null"
        @change="changeSeason"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.anime-filter {
  display: flex;
  flex-wrap: wrap;
  margin: -8px -10px 0;
}

.item {
  margin: 8px 10px 0;
}
</style>
