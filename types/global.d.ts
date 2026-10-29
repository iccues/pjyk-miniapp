/// <reference types="@tarojs/taro" />

declare module "*.scss";

// 业务代码只用到 process.env，构建时由 DefinePlugin 替换成常量，不引入完整的 Node 类型
declare const process: { env: NodeJS.ProcessEnv };

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    /** 当前构建的平台 */
    TARO_ENV: "tt" | "weapp" | "h5";
    /** 小程序端请求的 GraphQL 接口完整地址，默认值见 .env */
    TARO_APP_GRAPHQL_URL: string;
  }
}

// 由 build/markdown-loader.js 在构建期渲染成 rich-text 节点数组
declare module "*.md" {
  const nodes: Record<string, unknown>[];
  export default nodes;
}

declare module "@tarojs/components" {
  export * from "@tarojs/components/types/index.vue3";
}
