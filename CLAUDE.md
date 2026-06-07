# CLAUDE.md — Buggy Blog

基于 [astro-blog-shokax](https://github.com/theme-shoka-x/astro-blog-shokax) 的个人博客。

## 技术栈

Astro 6 + Svelte 5 + UnoCSS + Bun 运行时 + Pagefind 搜索 + HyC 内容管理

## 常用命令

```bash
bun run dev          # 开发服务器 (http://localhost:4321)
bun run build        # 生产构建
bun run preview      # 预览生产构建
bun run test         # 运行单元测试 (bun test)
bun run check        # Astro 类型检查 (astro check)
bun run lint         # oxlint 代码检查
bun run format       # oxfmt 代码格式化
```

**修改代码后至少执行:** `bun run format && bun run lint && bun run check`

## 关键文件

| 文件                          | 用途                                               |
| ----------------------------- | -------------------------------------------------- |
| `src/theme.config.ts`         | 🌟 主题配置（站点信息、布局、侧边栏、评论、友链等） |
| `src/content.config.ts`       | 内容集合配置                                       |
| `src/covers.config.ts`        | 封面图片 URL 列表（多图轮播用）                    |
| `src/components/Images.astro` | 封面预设表 + 头像导入                              |
| `astro.config.mjs`            | Astro 配置                                         |
| `hyacine.yml`                 | HyC 配置                                           |
| `hyacine.plugin.ts`           | HyC 插件配置                                       |
| `uno.config.ts`               | UnoCSS 配置                                        |

## 主题配置指南 (theme.config.ts)

配置文件位于 `src/theme.config.ts`，使用 `defineConfig()` 包裹。默认值在 `src/toolkit/themeConfig.defaults.ts`。

### 站点基础

```ts
siteName: "站点名称",
sidebar: {
  author: "作者名",
  description: "简介",
  social: { github: "https://github.com/xxx" },  // 社交链接
},
footer: {
  since: 2025,         // 建站年份
  icon: { name: "sakura rotate", color: "var(--color-pink)" },
  count: true,         // 访问统计
  powered: true,       // 显示 "Powered by ShokaX"
  icp: { enable: false, icpnumber: "", icpurl: "" },  // ICP 备案
},
```

### 布局模式

```ts
layout: {
  mode: "two-column",    // "two-column" | "three-column"
  // 三栏模式时可配置右侧栏卡片：
  rightSidebar: {
    order: ["announcement", "search", "calendar", "recentMoments", "randomPosts", "tagCloud"],
    announcement: true, search: true, calendar: true,
    recentMoments: true, randomPosts: true, tagCloud: true,
  },
},
```

### 封面

```ts
cover: {
  enable: true,           // 启用封面
  preload: true,          // 预加载封面图
  fixedCover: {           // 固定封面（单图）
    enable: true,
    url: "cover_iris",    // 对应 Images.astro 中 coverPresets 的 key
  },
  coverUrls: [],          // 多图轮播 URL（仅当 advancedCarousel 为 true）
  advancedCarousel: false,// true: ≥2 张即可轮播; false: 旧版需 6 张
},
```

### 导航栏

```ts
nav: [
  { href: "/", text: "首页", icon: "i-ri-home-line" },
  {
    text: "文章", href: "/random/", icon: "i-ri-quill-pen-fill",
    dropbox: {           // 下拉子菜单
      enable: true,
      items: [
        { href: "/categories/", text: "分类", icon: "i-ri-book-shelf-fill" },
      ],
    },
  },
],
```

### 评论 (Waline)

```ts
comments: {
  enable: true,
  waline: { serverURL: "https://your-waline-server.vercel.app", lang: "zh-CN" },
},
```

### 友链

```ts
friends: {
  title: "友链", description: "卡片式展示",
  links: [
    { url: "https://...", title: "站点名", desc: "描述", author: "作者",
      avatar: "头像URL", color: "var(--color-blue)" },
  ],
},
```

### 其他功能

```ts
nyxPlayer: {             // 音乐播放器
  enable: true,
  urls: [{ name: "歌单", url: "https://music.163.com/#/playlist?id=..." }],
},
hyc: {                   // AI 摘要 & 推荐
  enable: false,
  aiSummary: { enable: true, title: "AI 摘要" },
  aiRecommend: { enable: true, limit: 3 },
},
visibilityTitle: {       // 标签页离开/返回提示
  enable: true,
  leaveTitle: "👀 你先忙，我等你回来~",
  returnTitle: "🎉 欢迎回来！",
},
home: { pageSize: 5, selectedCategories: [{ name: "Tutorial" }] },
```

## 封面系统

封面图有两种使用方式：

### 1. 固定封面（当前方式）

- 在 `src/assets/images/` 放置 `.avif` 图片
- 在 `src/components/Images.astro` 中 import 并加入 `coverPresets`
- 在 `theme.config.ts` 中设置 `cover.fixedCover.url` 为 preset key

### 2. 多图轮播

- 在 `covers.config.ts` 中添加封面 URL
- 或在 `theme.config.ts` 的 `cover.coverUrls` 中配置
- 设置 `cover.advancedCarousel: true`（≥2 张即可）或留空（需要恰好 6 张）

### 头像

- 替换 `src/assets/avatar.avif`
- 在 `src/components/Images.astro` 中已通过 `export const avatar = avatarImg` 导出

## 内容管理

### HyC CLI

```bash
bun run hyc new "标题"       # 新建文章（推荐，已 patch 为常用格式）
bun run hyc publish "slug"   # 发布文章
bun run hyc sync             # 同步内容
bun run hyc serve            # 启动本地 CMS（访问 https://hyc.kaitaku.xyz）
```

> ⚠️ `bun install` 后 hyc 的 frontmatter 模板会被还原，需重跑 `bun run scripts/patch-hyc.ts`
> 详见 `scripts/patch-hyc.ts` — 它将 `hyc new` 生成的模板从旧格式改为 ShokaX 官方格式（date YYYY-MM-DD + updated + description + tags）。

### 手动写文章

直接在 `src/posts/` 下创建 `.md` 或 `.mdx` 文件，需要包含 frontmatter。

文章支持：KaTeX 数学公式、加密（AES-256-GCM）、MDX 自定义组件（折叠、高亮、标签、测验、剧透等）。

## 开发约定

- 语言：代码注释用中文，沟通用中文
- 路由：`trailingSlash: "always"` — 内部链接保留尾部 `/`
- Svelte 5 runes 风格：`$state` / `$props` / `$effect`
- 可复用工具放在 `src/toolkit/` 并写单元测试
- UI 组件或页面改动需补充 E2E 测试
- 架构：Astro + Svelte 5 + UnoCSS + Pagefind，不要随意偏离
