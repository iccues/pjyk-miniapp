<script setup lang="ts">
// 仅处理输入和提交，跳转方式由调用方决定
const keyword = defineModel<string>({ required: true });

const emit = defineEmits<{ submit: [] }>();

withDefaults(defineProps<{ placeholder?: string; focus?: boolean }>(), {
  placeholder: "搜索动画…",
  focus: false,
});
</script>

<template>
  <view class="search-bar">
    <!-- 输入框使用 16px 字号，避免 iOS 聚焦时页面缩放 -->
    <input
      v-model="keyword"
      class="input"
      type="text"
      confirm-type="search"
      :placeholder="placeholder"
      placeholder-style="color: #99a1af"
      :focus="focus"
      @confirm="emit('submit')"
    />
    <view class="button" hover-class="button--active" @tap="emit('submit')">搜索</view>
  </view>
</template>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid $gray-500;
  border-radius: 12px;
  background-color: #fff;
}

.input {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 14px;
  color: $gray-900;
  font-size: 16px;
  // 首页搜索框放在居中排版的区域里，输入内容仍然左对齐
  text-align: left;
}

.button {
  flex-shrink: 0;
  height: 36px;
  margin: 4px;
  padding: 0 16px;
  border-radius: 8px;
  background-color: $gray-900;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 36px;
}

.button--active {
  background-color: $gray-700;
}
</style>
