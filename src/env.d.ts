/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** GraphQL 接口的完整地址，默认指向线上环境 */
  readonly VITE_GRAPHQL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 由 build/markdown.ts 在构建期渲染成 rich-text 节点数组
declare module "*.md" {
  const nodes: Record<string, unknown>[];
  export default nodes;
}
