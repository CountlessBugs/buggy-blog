[English](./README.md) | [中文](./README_zh-cn.md)

# Buggy Blog

My personal blog — powered by [ShokaX Astro](https://github.com/theme-shoka-x/astro-blog-shokax) (Astro 6 + Svelte 5 + UnoCSS).

## Tech Stack

- **Framework:** [Astro 6](https://astro.build/)
- **UI:** [Svelte 5](https://svelte.dev/) + [UnoCSS](https://unocss.dev/)
- **Theme:** [ShokaX](https://github.com/theme-shoka-x/astro-blog-shokax)
- **Runtime:** [Bun](https://bun.sh/)
- **Search:** [Pagefind](https://pagefind.app/)
- **Content:** Markdown / MDX + [HyC](https://docs.astro.kaitaku.xyz/)

## Development

```bash
bun install           # Install dependencies
bun run dev           # Dev server → http://localhost:4321
bun run build         # Production build
bun run preview       # Preview production build
bun run test          # Run unit tests
bun run check         # Type check
bun run lint          # Lint
bun run format        # Format
bun run hyc new "标题" # 新建文章
```

> ⚠️ `bun install` 后 hyc 模板会被覆盖，需重跑 `bun run scripts/patch-hyc.ts`

## Project Structure

```
src/
├── assets/               # Avatar, covers, fonts, icons
│   ├── avatar.avif       # Avatar
│   └── images/           # Cover images
├── components/           # Astro / Svelte components
├── content/              # About, announcement, friend rules
├── layouts/              # Two-column / three-column layouts
├── moments/              # Status updates
├── pages/                # Routes
├── posts/                # Blog posts (.md / .mdx)
├── theme.config.ts       # Theme configuration
├── content.config.ts     # Content collections
└── toolkit/              # Utilities
```

## License

- **Code:** AGPL v3 — inherited from [ShokaX](https://github.com/theme-shoka-x/astro-blog-shokax)
- **Blog posts:** [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
- **Personal assets** (avatar, covers, etc.): All rights reserved
