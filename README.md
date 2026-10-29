# pjyk-miniapp

有希计划（Project Yuki）小程序，使用 [Taro](https://docs.taro.zone)（Vue 3）编写，同一份代码编译为抖音小程序（`tt`）和微信小程序（`weapp`），以抖音端为主。数据来自有希计划的线上 GraphQL 接口，页面和视觉参考 [pjyk](https://github.com/iccues/pjyk) 的前台 `web/apps/client`。

## 页面

底部三个标签页（首页 / 榜单 / 搜索），加三个普通页面：

| 页面     | 路径                  | 说明                                                                |
| -------- | --------------------- | ------------------------------------------------------------------- |
| 首页     | `pages/index/index`   | 标签页。标语，本季最佳/最热、年度最佳、历史最佳四行，每行可查看全部 |
| 榜单     | `pages/ranking/index` | 标签页。可筛选的动画列表，默认全部年份按评分排列                    |
| 搜索     | `pages/search/index`  | 标签页。边输边搜；没有输入时显示本季热门和文档入口                  |
| 动画详情 | `pages/anime/index`   | 自定义导航栏、封面头图、评分说明弹层、平台评分对比、同季度动画      |
| 列表     | `pages/list/index`    | 首页"查看全部"等入口打开的可筛选列表，与榜单是同一个组件            |
| 文章     | `pages/article/index` | 关于、评分说明、平台参数                                            |

### 榜单与列表页

两个页面的内容都是 `AnimeBrowser` 组件（年份、季度、排序、样式筛选 + 列表 + 分页加载），页面本身只是外壳：

- 榜单是标签页，默认全部年份、横向行
- 列表页是可以返回的普通页面，初始筛选来自入口（例如"2026年10月最热"），默认宫格

改筛选栏或列表的样式时，两个页面会一起变化。

### 列表样式

列表有海报宫格和横向行两种样式，工具栏右侧的按钮可以切换，切换时不重新请求。不同入口的默认样式不同：

| 入口     | 默认样式 | 名次                   |
| -------- | -------- | ---------------------- |
| 列表页   | 宫格     | 显示                   |
| 榜单     | 横向行   | 显示                   |
| 搜索结果 | 横向行   | 不显示（按匹配度排列） |

切换后的样式只在本次打开小程序期间保留，不存到本机。

### 分享与落地

各页面都支持转发分享，分享路径带上当前的季度、排序、样式、搜索词或动画 ID，对方打开后看到的内容一致。从分享卡片或视频挂载直接打开普通页面时没有上一页可以返回：详情页左上角改为"回首页"，列表页和文章页在右下角显示"首页"按钮。

## 开发

项目通过 `packageManager` 固定 pnpm 版本，首次使用可先启用 Corepack：

```bash
corepack enable
```

安装依赖并启动抖音端：

```bash
pnpm install
pnpm dev:tt
```

用抖音开发者工具导入 `dist/tt`。微信端用 `pnpm dev:weapp`，在微信开发者工具中导入 `dist/weapp`。

发布构建：

```bash
pnpm build:tt
```

产物同样在 `dist/tt`（微信端为 `build:weapp` 和 `dist/weapp`），开发和发布构建输出到同一个目录。`pnpm build` 会先做类型检查，再依次构建两个平台。

提交前可运行：

```bash
pnpm fmt:check && pnpm lint && pnpm type-check
```

### 浏览器预览

`pnpm dev:h5` 可以在浏览器里预览页面（`http://localhost:5180`），适合调样式；最终效果以开发者工具和真机为准。

线上接口不允许跨域，H5 下的请求固定发到同源的 `/api/graphql`，由开发服务器转发到线上接口。要联调本地运行的 pjyk 后端，在 `.env.local` 里加一行：

```
TARO_APP_API_PROXY=http://localhost:8080
```

H5 只用于本地预览，`build:h5` 的产物同样依赖 `/api` 的转发，不能直接部署。

### GraphQL

查询写在 `src/graphql/queries/*.graphql`。`schema.graphqls` 是 pjyk 后端 schema 的副本，后端改动后需要同步过来。修改查询或 schema 后运行：

```bash
pnpm codegen
```

codegen 使用 `documentMode: "string"`，查询以字符串形式由 `Taro.request` 发送，小程序包里不引入 `graphql` 运行时。

## 配置

- **接口地址**：小程序端请求 `.env` 里的 `TARO_APP_GRAPHQL_URL`（`https://www.yukiani.com/api/graphql`），可在 `.env.local` 或命令行里覆盖；只有 `TARO_APP_` 开头的变量会在构建时替换进代码。H5 的请求地址见上面的"浏览器预览"。
- **AppID**：抖音端填在 `project.tt.json`，微信端填在 `project.config.json`；`touristappid` 是开发者工具的测试号。也可以用环境变量 `TARO_APP_ID` 在构建时替换。
- **合法域名**：上线前需要在抖音开放平台和微信公众平台把接口域名加入 request 合法域名（必须是 HTTPS，一般还要求 ICP 备案）。两个项目配置文件里的 `urlCheck: false` 只在开发者工具里跳过校验。

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

- 页面按小程序的使用习惯组织：底部标签页、详情页沉浸式头图、评分说明用底部弹层；首页内容与前台一致
- 小程序不能打开外部网站，平台评分点击后提供"复制条目链接"
- 列表的页码分页改为触底加载
- 文档在构建期由 `build/markdown-loader.js` 渲染成 `rich-text` 节点，公式转成纯文本（小程序里没有 KaTeX）
- 配色写在 `src/styles/variables.scss`，取自前台使用的 Tailwind 色板

## 编写约定

- Taro 的小程序端不支持 `<style scoped>`，各组件的样式最终合并到一起。class 一律用组件前缀的 BEM 命名（如 `row-card__title`、`segmented--disabled`），`@keyframes` 名称也带上组件前缀
- 样式按 `px` 书写，`config/index.ts` 关闭了 `pxtransform`，各端都不做 rpx 换算；不要使用 `rpx`，H5 不认识
- 页面生命周期用 `@tarojs/taro` 的 `useLoad`、`useDidShow`、`useReachBottom` 等 hooks；用到 `useShareAppMessage` 的页面要在 `index.config.ts` 里设置 `enableShareAppMessage: true`
- 布尔属性要写成绑定形式（`:scroll-x="true"`、`:lazy-load="true"`），只写属性名在小程序端会被当成空字符串
- 平台给 `button` 的默认样式带属性选择器，覆盖时需要两层类名（见详情页的分享按钮）
- 样式不要使用 `*` 选择器，微信小程序不支持
- `hover-class` 只对 `view`、`button`、`navigator` 生效
- 图片使用 PNG/JPG，各平台 `image` 组件对 SVG 的支持不一致
- 不要依赖 `Intl`，部分安卓运行环境没有；数字格式化见 `src/utils/format.ts`
- 标签页之间只能用 `switchTab` 切换且不能带参数；需要带参数打开的列表用普通页面 `pages/list`
- 榜单和列表页的内容只改 `AnimeBrowser` 及其子组件，不要在两个页面外壳里各写一份
- 打开普通页面用 `src/utils/navigation.ts` 的 `openPage`，页面栈接近 10 层上限时会改为替换当前页
- 自定义导航栏的尺寸按运行时胶囊按钮的位置计算（`getNavBarMetrics`），抖音和微信不同
- 页面顶部的导航栏不显示标题（各页面 `index.config.ts` 里标题留空），不要再调用 `setNavigationBarTitle`
