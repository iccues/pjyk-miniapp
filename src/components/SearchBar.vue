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
    <image class="search-bar__icon" src="/static/icons/search.png" mode="aspectFit" />
    <!-- 输入框使用 16px 字号，避免 iOS 聚焦时页面缩放 -->
    <input
      v-model="keyword"
      class="search-bar__input"
      type="text"
      confirm-type="search"
      :placeholder="placeholder"
      placeholder-style="color: #99a1af"
      :focus="focused"
      @focus="focused = true"
      @blur="focused = false"
      @confirm="emit('confirm')"
    />
    <view v-if="keyword" class="search-bar__clear" @tap="clear">
      <view class="search-bar__clear-icon" />
    </view>
  </view>
</template>

<style lang="scss">
/* 高度由外层决定，放在顶栏里时与胶囊按钮等高 */
.search-bar {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 12px;
  border-radius: 12px;
  background-color: $gray-100;
}

.search-bar__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.search-bar__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 8px;
  color: $gray-900;
  font-size: 16px;
}

/* H5 的输入框外面包了一层 taro-input-core，里面的 .weui-input 才是真正的输入框，要撑满高度才能垂直居中 */
.search-bar__input .weui-input {
  height: 100%;
}

.search-bar__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 100%;
}

/* 灰色圆底上画一个 ×，两条线由伪元素旋转得到 */
.search-bar__clear-icon {
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: $gray-400;
}

.search-bar__clear-icon::before,
.search-bar__clear-icon::after {
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

.search-bar__clear-icon::after {
  transform: rotate(-45deg);
}
</style>
