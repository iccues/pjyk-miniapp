import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  // 从 pjyk 仓库的 server/src/main/resources/graphql/schema.graphqls 复制而来，后端改动后需要同步
  schema: "schema.graphqls",
  documents: "src/**/*.graphql",
  generates: {
    "src/graphql/generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        // 小程序没有 fetch，也不引入 graphql 运行时，查询以字符串形式直接发给 Taro.request
        documentMode: "string",
        useTypeImports: true,
        enumsAsTypes: true,
        scalars: {
          ID: "number",
        },
      },
      plugins: [],
    },
  },
};

export default config;
