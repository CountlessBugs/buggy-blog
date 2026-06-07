[English](./README.md) | [中文](./README_zh-cn.md)

# Buggy Blog

个人博客 — 基于 [ShokaX Astro](https://github.com/theme-shoka-x/astro-blog-shokax)（Astro 6 + Svelte 5 + UnoCSS）

## 技术栈

- **框架:** [Astro 6](https://astro.build/)
- **UI:** [Svelte 5](https://svelte.dev/) + [UnoCSS](https://unocss.dev/)
- **主题:** [ShokaX](https://github.com/theme-shoka-x/astro-blog-shokax)
- **运行时:** [Bun](https://bun.sh/)
- **搜索:** [Pagefind](https://pagefind.app/)
- **内容:** Markdown / MDX + [HyC](https://docs.astro.kaitaku.xyz/)

## 开发

```bash
bun install           # 安装依赖
bun run dev           # 开发服务器 → http://localhost:4321
bun run build         # 生产构建
bun run preview       # 预览生产构建
bun run test          # 单元测试
bun run check         # 类型检查
bun run lint          # Lint
bun run format        # 格式化
```

## 项目结构

```
src/
├── assets/               # 头像、封面、字体、图标
│   ├── avatar.avif       # 头像
│   └── images/           # 封面图片
├── components/           # Astro / Svelte 组件
├── content/              # 关于、公告、友链规则
├── layouts/              # 双栏 / 三栏布局
├── moments/              # 说说 / 动态
├── pages/                # 路由页面
├── posts/                # 文章 (.md / .mdx)
├── theme.config.ts       # 主题配置
├── content.config.ts     # 内容集合
└── toolkit/              # 工具函数
```

## 许可

- **代码:** AGPL v3 — 继承自 [ShokaX](https://github.com/theme-shoka-x/astro-blog-shokax)
- **文章:** [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
- **个人素材**（头像、封面等）: 保留所有权利
