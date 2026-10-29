import path from "node:path";

import { defineConfig, type UserConfigExport } from "@tarojs/cli";

import devConfig from "./dev";
import prodConfig from "./prod";

const root = path.resolve(__dirname, "..");

// 文档 Markdown 在构建期渲染成 rich-text 节点，小程序和 H5 共用同一个 loader
const addMarkdownLoader = (chain: { module: any }) => {
  chain.module
    .rule("markdown")
    .test(/\.md$/)
    .use("markdown")
    .loader(path.join(root, "build/markdown-loader.js"));
};

// https://docs.taro.zone/docs/config
export default defineConfig<"webpack5">(async (merge) => {
  const baseConfig: UserConfigExport<"webpack5"> = {
    projectName: "pjyk-miniapp",
    date: "2026-10-29",
    designWidth: 375,
    deviceRatio: { 375: 2, 640: 2.34 / 2, 750: 1, 828: 1.81 / 2 },
    sourceRoot: "src",
    // 各平台分开输出，开发者工具分别导入 dist/tt、dist/weapp
    outputRoot: `dist/${process.env.TARO_ENV}`,
    plugins: [],
    alias: {
      "@": path.join(root, "src"),
    },
    // 每个 scss 样式块自动注入配色等变量，组件里不用再手动 @use
    sass: {
      resource: [path.join(root, "src/styles/variables.scss")],
    },
    copy: {
      patterns: [{ from: "src/static/", to: `dist/${process.env.TARO_ENV}/static/` }],
      options: {},
    },
    framework: "vue3",
    compiler: "webpack5",
    cache: { enable: false },
    mini: {
      // 各组件的 class 都带组件前缀，样式之间没有覆盖关系，合并时不用在意先后顺序
      miniCssExtractPluginOption: { ignoreOrder: true },
      postcss: {
        // 样式按 px 书写，不做 rpx 换算，保持各端尺寸与设计一致
        pxtransform: { enable: false, config: {} },
      },
      webpackChain(chain) {
        addMarkdownLoader(chain);
      },
    },
    h5: {
      publicPath: "/",
      staticDirectory: "static",
      output: {
        filename: "js/[name].[contenthash:8].js",
        chunkFilename: "js/[name].[chunkhash:8].js",
      },
      router: { mode: "hash" },
      miniCssExtractPluginOption: { ignoreOrder: true },
      devServer: {
        port: 5180,
        // 仅 H5 调试使用；小程序端直接请求 TARO_APP_GRAPHQL_URL 指向的完整地址
        proxy: {
          "/api": {
            target: process.env.API_PROXY ?? "http://localhost:8080",
            changeOrigin: true,
          },
        },
      },
      postcss: {
        pxtransform: { enable: false, config: {} },
        autoprefixer: { enable: true, config: {} },
      },
      webpackChain(chain) {
        addMarkdownLoader(chain);
      },
    },
  };

  if (process.env.NODE_ENV === "development") {
    return merge({}, baseConfig, devConfig);
  }
  return merge({}, baseConfig, prodConfig);
});
