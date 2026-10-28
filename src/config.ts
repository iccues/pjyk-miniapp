/**
 * 小程序只能请求在后台配置过的 HTTPS 域名，本地联调时可在 .env.local 里改成其他地址
 */
export const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || "https://www.yukiani.com/api/graphql";
