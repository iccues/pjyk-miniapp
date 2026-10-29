<script setup lang="ts">
// 只负责输入；什么时候发起搜索由页面决定
const keyword = defineModel<string>({ required: true });
const focused = defineModel<boolean>("focused", { default: false });

const emit = defineEmits<{ confirm: [] }>();

withDefaults(defineProps<{ placeholder?: string }>(), { placeholder: "搜索动画名称" });

const clear = () => {
  keyword.value = "";
  focused.value = true;
};
</script>

<template>
  <view class="search-bar">
    <image class="icon" src="/static/icons/search.png" mode="aspectFit" />
    <!-- 输入框使用 16px 字号，避免 iOS 聚焦时页面缩放 -->
    <input
      v-model="keyword"
      class="input"
      type="text"
      confirm-type="search"
      :placeholder="placeholder"
      placeholder-style="color: #99a1af"
      :focus="focused"
      @focus="focused = true"
      @blur="focused = false"
      @confirm="emit('confirm')"
    />
    <view v-if="keyword" class="clear" @tap="clear">
      <view class="clear-icon" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  height: 40px;
  padding-left: 12px;
  border-radius: 20px;
  background-color: $gray-100;
}

.icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.input {
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 8px;
  color: $gray-900;
  font-size: 16px;
}

.clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

/* 灰色圆底上画一个 ×，两条线由伪元素旋转得到 */
.clear-icon {
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: $gray-400;
}

.clear-icon::before,
.clear-icon::after {
  content: "";
  position: absolute;
  top: 7px;
  left: 4px;
  width: 8px;
  height: 2px;
  border-radius: 1px;
  background-color: #fff;
  transform: rotate(45deg);
}

.clear-icon::after {
  transform: rotate(-45deg);
}
</style>
