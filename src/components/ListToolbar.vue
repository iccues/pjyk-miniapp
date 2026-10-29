<script setup lang="ts">
import type { ListLayout } from "@/constants/ui-options";
import { SORT_BY_OPTIONS } from "@/constants/ui-options";
import type { SortBy } from "@/graphql/generated/graphql";
import { openPage } from "@/utils/navigation";
import { routes } from "@/utils/routes";

import LayoutToggle from "./LayoutToggle.vue";
import SegmentedControl from "./SegmentedControl.vue";

// 不传 sortBy 时不显示排序（例如搜索结果），左侧改为显示 summary
defineProps<{ sortBy?: SortBy; summary?: string }>();

const layout = defineModel<ListLayout>("layout", { required: true });

const emit = defineEmits<{ "update:sortBy": [value: SortBy] }>();

const changeSortBy = (value: SortBy) => {
  emit("update:sortBy", value);
};

const openMetricArticle = () => {
  openPage(routes.article("metric"));
};
</script>

<template>
  <view class="toolbar">
    <SegmentedControl
      v-if="sortBy"
      :options="SORT_BY_OPTIONS"
      :value="sortBy"
      @change="changeSortBy"
    />
    <text v-else class="summary">{{ summary }}</text>

    <view class="actions">
      <view class="help" hover-class="help--active" @tap="openMetricArticle">
        <text>评分说明</text>
        <view class="help-icon">?</view>
      </view>
      <LayoutToggle v-model="layout" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $list-toolbar-height;
}

.summary {
  color: $gray-500;
  font-size: 13px;
}

.actions {
  display: flex;
  align-items: center;
}

.help {
  display: flex;
  align-items: center;
  margin-right: 4px;
  padding: 4px 6px;
  border-radius: 6px;
  color: $gray-500;
  font-size: 12px;
}

.help--active {
  background-color: $gray-100;
}

.help-icon {
  width: 13px;
  height: 13px;
  margin-left: 3px;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 10px;
  line-height: 13px;
  text-align: center;
}
</style>
