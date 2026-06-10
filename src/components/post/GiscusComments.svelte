<script lang="ts">
  import { onMount } from "svelte";
  import { currentLocale, t } from "@/i18n";

  interface Props {
    repo?: string;
    repoId?: string;
    category?: string;
    categoryId?: string;
    mapping?: string;
    strict?: boolean;
    reactionsEnabled?: boolean;
    emitMetadata?: boolean;
    inputPosition?: "top" | "bottom";
    theme?: string;
    lang?: string;
  }

  const {
    repo = "",
    repoId = "",
    category = "",
    categoryId = "",
    mapping = "pathname",
    strict = true,
    reactionsEnabled = true,
    emitMetadata = false,
    inputPosition = "bottom",
    theme = "",
    lang = currentLocale,
  }: Props = $props();

  let containerEl = $state<HTMLDivElement | null>(null);
  const isConfigured = $derived(Boolean(repo && repoId && category && categoryId));

  // 从文档根节点的 data-theme 属性推断 Giscus 主题
  function resolveTheme(): string {
    if (theme) return theme;

    const rootTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    return rootTheme === "dark" ? "dark" : "light";
  }

  function loadGiscus() {
    if (!containerEl || !isConfigured) return () => {};

    // 移除之前的 giscus 实例
    const existing = containerEl.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (existing) existing.remove();

    const currentTheme = resolveTheme();

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", mapping);
    script.setAttribute("data-strict", strict ? "1" : "0");
    script.setAttribute("data-reactions-enabled", reactionsEnabled ? "1" : "0");
    script.setAttribute("data-emit-metadata", emitMetadata ? "1" : "0");
    script.setAttribute("data-input-position", inputPosition);
    script.setAttribute("data-theme", currentTheme);
    script.setAttribute("data-lang", lang);
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    containerEl.appendChild(script);

    return () => {
      script.remove();
      if (containerEl) {
        const frame = containerEl.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
        if (frame) frame.remove();
      }
    };
  }

  let cleanup = $state<(() => void) | undefined>(undefined);

  onMount(() => {
    cleanup = loadGiscus();

    // 监听主题切换，同步更新 giscus 主题
    function sendTheme() {
      const currentTheme = resolveTheme();
      const frame = containerEl?.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      if (frame?.contentWindow) {
        frame.contentWindow.postMessage(
          { giscus: { setConfig: { theme: currentTheme } } },
          "https://giscus.app",
        );
      }
    }

    const observer = new MutationObserver(() => {
      sendTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    sendTheme();

    return () => {
      cleanup?.();
      observer.disconnect();
    };
  });
</script>

{#if isConfigured}
  <div bind:this={containerEl}></div>
{:else}
  <div class="giscus-disabled">{t("footer.commentNotConfigured")}</div>
{/if}

<style>
  .giscus-disabled {
    border: 1px dashed var(--grey-4);
    color: var(--grey-5);
    border-radius: 0.5rem;
    padding: 1rem;
    text-align: center;
    font-size: 0.875rem;
  }
</style>
