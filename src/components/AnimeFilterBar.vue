<script setup lang="ts">
import type { ListLayout } from "@/constants/ui-options";
import { SEASON_OPTIONS } from "@/constants/ui-options";
import type { Season, SortBy } from "@/graphql/generated/graphql";
import { applyFilterChanges, type AnimeListFilters } from "@/utils/filters";

import ListToolbar from "./ListToolbar.vue";
import TabItem from "./TabItem.vue";
import YearPicker from "./YearPicker.vue";

// 第一行选年份和季度，第二行是排序、评分说明和样式切换
const props = defineProps<{ filters: AnimeListFilters }>();

const layout = defineModel<ListLayout>("layout", { required: true });

const emit = defineEmits<{ "update:filters": [filters: AnimeListFilters] }>();

const change = (changes: Partial<AnimeListFilters>) => {
  emit("update:filters", applyFilterChanges(props.filters, changes));
};

const changeYear = (year: number | undefined) => change({ year });
const changeSeason = (season: Season | undefined) => change({ season });
const changeSortBy = (sortBy: SortBy) => change({ sortBy });
</script>

<template>
  <view class="filter-bar">
    <view class="row">
      <YearPicker :model-value="filters.year" @update:model-value="changeYear" />
      <view class="seasons">
        <view v-for="option in SEASON_OPTIONS" :key="option.label" class="season">
          <TabItem
            :label="option.label"
            :active="option.value === filters.season"
            :disabled="filters.year == null"
            @select="changeSeason(option.value)"
          />
        </view>
      </view>
    </view>
    <ListToolbar v-model:layout="layout" :sort-by="filters.sortBy" @update:sort-by="changeSortBy" />
  </view>
</template>

<style lang="scss" scoped>
.filter-bar {
  padding: 0 $page-gutter;
}

.row {
  display: flex;
  align-items: center;
  height: $list-tabs-height;
}

.seasons {
  display: flex;
  margin-left: 16px;
}

.season + .season {
  margin-left: 16px;
}
</style>
