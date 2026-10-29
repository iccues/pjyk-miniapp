# pjyk-miniapp

有希计划（Project Yuki）小程序，使用 uni-app（Vue 3）编写，同一份代码编译为抖音小程序（`mp-toutiao`）和微信小程序（`mp-weixin`），以抖音端为主。数据来自有希计划的线上 GraphQL 接口，页面和视觉参考 [pjyk](https://github.com/iccues/pjyk) 的前台 `web/apps/client`。

## 页面

底部三个标签页，加三个普通页面：

| 页面     | 路径                  | 说明                                                            |
| -------- | --------------------- | --------------------------------------------------------------- |
| 新番     | `pages/season/index`  | 标签页。季度切换（最近 8 个季度平铺，更早的在"更早"里选）、排序 |
| 榜单     | `pages/ranking/index` | 标签页。年度榜（可选年份）/ 历史榜、排序                        |
| 搜索     | `pages/search/index`  | 标签页。边输边搜；没有输入时显示本季热门、按季度浏览和文档入口  |
| 动画详情 | `pages/anime/index`   | 自定义导航栏、封面头图、评分说明弹层、平台评分对比、同季度动画  |
| 季度列表 | `pages/list/index`    | 某个季度的完整列表，从详情页"查看全部"和搜索页的季度入口进入    |
| 文章     | `pages/article/index` | 关于、评分说明、平台参数                                        |

### 列表样式

列表有海报宫格和横向行两种样式，工具栏右侧的按钮可以切换，切换时不重新请求。不同入口的默认样式不同：

| 入口           | 默认样式 | 名次                   |
| -------------- | -------- | ---------------------- |
| 新番、季度列表 | 宫格     | 显示                   |
| 榜单           | 横向行   | 显示                   |
| 搜索结果       | 横向行   | 不显示（按匹配度排列） |

切换后的样式只在本次打开小程序期间保留，不存到本机。

### 分享与落地

各页面都支持转发分享，分享路径带上当前的季度、排序、样式、搜索词或动画 ID，对方打开后看到的内容一致。从分享卡片或视频挂载直接打开普通页面时没有上一页可以返回：详情页左上角改为"回首页"，季度列表和文章页在右下角显示"首页"按钮。

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

- 页面按小程序的使用习惯组织：底部标签页、详情页沉浸式头图、评分说明用底部弹层
- 小程序不能打开外部网站，平台评分点击后提供"复制条目链接"
- 列表的页码分页改为触底加载
- 文档在构建期由 `build/markdown.ts` 渲染成 `rich-text` 节点，公式转成纯文本（小程序里没有 KaTeX）
- 配色写在 `src/uni.scss`，取自前台使用的 Tailwind 色板

## 编写约定

- 样式不要使用 `*` 选择器，微信小程序不支持
- `hover-class` 只对 `view`、`button`、`navigator` 生效
- 图片使用 PNG/JPG，各平台 `image` 组件对 SVG 的支持不一致
- 不要依赖 `Intl`，部分安卓运行环境没有；数字格式化见 `src/utils/format.ts`
- 标签页之间只能用 `switchTab` 切换且不能带参数；需要带参数打开的列表用普通页面 `pages/list`
- 打开普通页面用 `src/utils/navigation.ts` 的 `openPage`，页面栈接近 10 层上限时会改为替换当前页
- 自定义导航栏的尺寸按运行时胶囊按钮的位置计算（`getNavBarMetrics`），抖音和微信不同
