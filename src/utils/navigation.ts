import { TAB_PAGES } from "./routes";

// 小程序页面栈最多 10 层，留出余量后改为替换当前页，避免详情连续跳详情时打不开
const MAX_STACK_DEPTH = 8;

/**
 * 打开普通页面
 */
export const openPage = (url: string) => {
  if (getCurrentPages().length >= MAX_STACK_DEPTH) {
    uni.redirectTo({ url });
  } else {
    uni.navigateTo({ url });
  }
};

export const goHome = () => {
  uni.switchTab({ url: TAB_PAGES.season });
};

/**
 * 当前页是否是打开小程序后的第一页，例如从分享卡片或视频挂载直接进入，这时没有上一页可以返回
 */
export const isEntryPage = (): boolean => getCurrentPages().length <= 1;

export interface NavBarMetrics {
  /** 状态栏高度，自定义导航栏要从它下面开始 */
  statusBarHeight: number;
  /** 导航栏高度，和右上角胶囊按钮垂直居中对齐 */
  navBarHeight: number;
  /** 胶囊按钮占用的右侧宽度，标题左右各留出这么多，保证居中且不被遮挡 */
  capsuleSpace: number;
}

let navBarMetrics: NavBarMetrics | undefined;

/**
 * 自定义导航栏的尺寸；胶囊按钮的位置抖音和微信不同，按运行时的实际位置计算
 */
export const getNavBarMetrics = (): NavBarMetrics => {
  if (navBarMetrics) return navBarMetrics;

  const { statusBarHeight = 0, windowWidth } = uni.getSystemInfoSync();
  navBarMetrics = { statusBarHeight, navBarHeight: 44, capsuleSpace: 56 };

  try {
    const rect = uni.getMenuButtonBoundingClientRect();
    if (rect?.height > 0) {
      navBarMetrics.navBarHeight = (rect.top - statusBarHeight) * 2 + rect.height;
      navBarMetrics.capsuleSpace = windowWidth - rect.left + 8;
    }
  } catch {
    // H5 没有胶囊按钮，使用默认尺寸
  }

  return navBarMetrics;
};

/**
 * 隐藏平台在导航栏自动加的"返回首页"按钮，统一使用页面里的按钮
 */
export const hideNativeHomeButton = () => {
  try {
    uni.hideHomeButton?.();
  } catch {
    // 部分平台没有这个接口，保留平台自带的按钮即可
  }
};
