// cannot use path alias here because unocss can not resolve it
import { defineConfig } from "./toolkit/themeConfig";

export default defineConfig({
  siteName: "Buggy Blog",
  brand: {
    title: "Buggy Blog",
    subtitle: "一只计算机萌新的个人博客",
    logo: "🐱",
  },
  sidebar: {
    author: "亿个Bugs",
    description: "Bug Generator :)",
  },
  cover: {
    enable: true,
    preload: true,
    fixedCover: {
      enable: true,
      url: "cover_iris",
    },
    coverUrls: [],
  },
  layout: {
    mode: "two-column",
  },
  copyright: {
    license: "CC-BY-NC-4.0",
    show: true,
  },
});
