/**
 * 小程序端使用 .env 中的 TARO_APP_GRAPHQL_URL
 *
 * 线上接口不允许跨域，H5 预览时浏览器不能直接请求，改为请求同源地址，由开发服务器代理转发（见 config/index.ts）
 */
export const GRAPHQL_URL =
  process.env.TARO_ENV === "h5" ? "/api/graphql" : process.env.TARO_APP_GRAPHQL_URL;
