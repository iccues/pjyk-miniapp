# pjyk-miniapp

有希计划（Project Yuki）小程序，使用 uni-app（Vue 3）编写，同一份代码编译为抖音小程序（`mp-toutiao`）和微信小程序（`mp-weixin`），以抖音端为主。数据来自有希计划的线上 GraphQL 接口，页面和视觉参考 [pjyk](https://github.com/iccues/pjyk) 的前台 `web/apps/client`。

## 页面

| 页面     | 路径                       | 说明                                                  |
| -------- | -------------------------- | ----------------------------------------------------- |
| 首页     | `pages/index/index`        | 搜索框，本季最佳/最热、年度最佳、历史最佳四行横向列表 |
| 动画列表 | `pages/anime-list/index`   | 年份、排序、季度筛选，触底加载下一页                  |
| 搜索     | `pages/search/index`       | 按关键词搜索，触底加载下一页                          |
| 动画详情 | `pages/anime-detail/index` | 综合评分、人气和各平台数据，点击平台卡片复制条目链接  |
| 文档     | `pages/docs/index`         | 关于、评分说明、平台参数                              |

各页面都支持转发分享，分享路径会带上当前的筛选条件、搜索词或动画 ID。

## 开发

项目通过 `packageManager` 固定 pnpm 版本，首次使用可先启用 Corepack：

```bash
corepack enable
```

安装依赖并启动抖音端：

```bash
pnpm install
pnpm dev:mp-toutiao
```

用抖音开发者工具导入 `dist/dev/mp-toutiao`。微信端用 `pnpm dev:mp-weixin`，在微信开发者工具中导入 `dist/dev/mp-weixin`。

发布构建：

```bash
pnpm build:mp-toutiao
```

产物在 `dist/build/mp-toutiao`（微信端为 `build:mp-weixin` 和 `dist/build/mp-weixin`）。`pnpm build` 会先做类型检查，再依次构建两个平台。

提交前可运行：

```bash
pnpm fmt:check && pnpm lint && pnpm type-check
```

### 浏览器预览

`dev:h5` 可以在浏览器里预览页面，适合调样式；最终效果以开发者工具和真机为准。H5 下需要让请求走开发服务器代理：

```bash
VITE_GRAPHQL_URL=/api/graphql VITE_API_PROXY=https://www.yukiani.com pnpm dev:h5
```

`VITE_API_PROXY` 默认是 `http://localhost:8080`，即本地运行的 pjyk 后端。

### GraphQL

查询写在 `src/graphql/queries/*.graphql`。`schema.graphqls` 是 pjyk 后端 schema 的副本，后端改动后需要同步过来。修改查询或 schema 后运行：

```bash
pnpm codegen
```

codegen 使用 `documentMode: "string"`，查询以字符串形式由 `uni.request` 发送，小程序包里不引入 `graphql` 运行时。

## 配置

- **接口地址**：默认请求 `https://www.yukiani.com/api/graphql`。本地联调可在 `.env.local` 中设置 `VITE_GRAPHQL_URL`。
- **AppID**：在 `src/manifest.json` 的 `mp-toutiao.appid`、`mp-weixin.appid` 中填写；留空时开发者工具使用测试号。
- **合法域名**：上线前需要在抖音开放平台和微信公众平台把接口域名加入 request 合法域名（必须是 HTTPS，一般还要求 ICP 备案）。`manifest.json` 里的 `urlCheck: false` 只在开发者工具里跳过校验。

## 与 pjyk 同步的内容

以下文件从 pjyk 复制而来，pjyk 那边改动后需要手动同步：

| 本项目                        | pjyk                                                |
| ----------------------------- | --------------------------------------------------- |
| `schema.graphqls`             | `server/src/main/resources/graphql/schema.graphqls` |
| `src/docs/*.md`               | `web/apps/client/src/docs/content/*.md`             |
| `src/constants/platforms.ts`  | `web/packages/shared/src/config/platforms.ts`       |
| `src/constants/ui-options.ts` | `web/apps/client/src/constants/ui-options.ts`       |
| `src/static/platforms/*.png`  | `web/packages/shared/src/assets/logo/`              |

## 与前台的差异

- 小程序不能打开外部网站，平台卡片改为复制条目链接
- 列表的页码分页改为触底加载
- 文档在构建期由 `build/markdown.ts` 渲染成 `rich-text` 节点，公式转成纯文本（小程序里没有 KaTeX）
- 配色写在 `src/uni.scss`，取自前台使用的 Tailwind 色板

## 编写约定

- 样式不要使用 `*` 选择器，微信小程序不支持
- `hover-class` 只对 `view`、`button`、`navigator` 生效
- 图片使用 PNG/JPG，各平台 `image` 组件对 SVG 的支持不一致
- 不要依赖 `Intl`，部分安卓运行环境没有；数字格式化见 `src/utils/format.ts`
