import uni from "@dcloudio/vite-plugin-uni";
import { defineConfig } from "vite";

import markdown from "./build/markdown";

// https://uniapp.dcloud.net.cn/collocation/vite-config.html
export default defineConfig({
  plugins: [uni(), markdown()],
  server: {
    // 仅 H5 调试使用；小程序端直接请求 VITE_GRAPHQL_URL 指向的完整地址
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY ?? "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
