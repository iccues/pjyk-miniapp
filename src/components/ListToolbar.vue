<script setup lang="ts">
import { ref } from "vue";

import type { ListLayout } from "@/constants/ui-options";
import { SORT_BY_OPTIONS } from "@/constants/ui-options";
import type { SortBy } from "@/graphql/generated/graphql";

import LayoutToggle from "./LayoutToggle.vue";
import ScoreHelpSheet from "./ScoreHelpSheet.vue";
import SegmentedControl from "./SegmentedControl.vue";

// 不传 sortBy 时不显示排序（例如搜索结果），左侧改为显示 summary
defineProps<{ sortBy?: SortBy; summary?: string }>();

const layout = defineModel<ListLayout>("layout", { required: true });

const emit = defineEmits<{ "update:sortBy": [value: SortBy] }>();

const changeSortBy = (value: SortBy) => {
  emit("update:sortBy", value);
};

// 评分说明用底部弹层，和详情页的"综合评分"一致，弹层里可以再打开完整说明
const helpVisible = ref(false);
</script>

<template>
  <view class="list-toolbar">
    <SegmentedControl
      v-if="sortBy"
      :options="SORT_BY_OPTIONS"
      :value="sortBy"
      @change="changeSortBy"
    />
    <text v-else class="list-toolbar__summary">{{ summary }}</text>

    <view class="list-toolbar__actions">
      <view
        class="list-toolbar__help"
        hover-class="list-toolbar__help--active"
        @tap="helpVisible = true"
      >
        <text>评分说明</text>
        <view class="list-toolbar__help-icon">?</view>
      </view>
      <LayoutToggle v-model="layout" />
    </view>

    <ScoreHelpSheet :visible="helpVisible" @close="helpVisible = false" />
  </view>
</template>

<style lang="scss">
.list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $list-toolbar-height;
}

.list-toolbar__summary {
  color: $gray-500;
  font-size: 13px;
}

.list-toolbar__actions {
  display: flex;
  align-items: center;
}

.list-toolbar__help {
  display: flex;
  align-items: center;
  margin-right: 4px;
  padding: 4px 6px;
  border-radius: 6px;
  color: $gray-500;
  font-size: 12px;
}

.list-toolbar__help--active {
  background-color: $gray-100;
}

.list-toolbar__help-icon {
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
