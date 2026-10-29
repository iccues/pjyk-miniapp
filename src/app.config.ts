export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/ranking/index",
    "pages/search/index",
    "pages/anime/index",
    "pages/list/index",
    "pages/article/index",
  ],
  window: {
    // 所有页面都不用平台的原生顶栏，返回按钮由页面里的 NavBar 组件提供
    navigationStyle: "custom",
    // 关掉原生顶栏后，这一项决定状态栏文字（时间、电量）的颜色
    navigationBarTextStyle: "black",
    backgroundColor: "#ffffff",
    backgroundTextStyle: "dark",
  },
  tabBar: {
    color: "#99a1af",
    selectedColor: "#101828",
    backgroundColor: "#ffffff",
    borderStyle: "white",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "static/tabbar/home.png",
        selectedIconPath: "static/tabbar/home-active.png",
      },
      {
        pagePath: "pages/ranking/index",
        text: "榜单",
        iconPath: "static/tabbar/ranking.png",
        selectedIconPath: "static/tabbar/ranking-active.png",
      },
      {
        pagePath: "pages/search/index",
        text: "搜索",
        iconPath: "static/tabbar/search.png",
        selectedIconPath: "static/tabbar/search-active.png",
      },
    ],
  },
  // 微信端按需注入组件代码，抖音端没有这个配置项
  ...(process.env.TARO_ENV === "weapp" ? { lazyCodeLoading: "requiredComponents" } : {}),
});
