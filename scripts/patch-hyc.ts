/**
 * Patch hyc new 的 frontmatter 模板，对齐 ShokaX 官方格式。
 * - 日期使用上海时间 (UTC+8)，精确到分钟，ISO 8601 +08:00 格式
 * - draft 替换为 cover
 * - 移除正文区自动生成的标题和占位文字
 * 每次 `bun install` 后需要重跑: bun run scripts/patch-hyc.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

type Patch = {
  file: string;
  old: string;
  new: string;
  label: string;
};

// ═══════════════════════════════════════════════════════════
// index.mjs — 内联模板（单行）
// ═══════════════════════════════════════════════════════════

// 原始 hyc（toISOString，无 updated/description/tags）
const IDX_ORIGINAL =
  "let p=new Date().toISOString(),m=st(i),h=`---\\ntitle: ${ot(n)}\\ndate: ${p}\\ndraft: ${r}\\n${m}\\n---\\n\\n# ${n}\\n\\n在这里开始写作...\\n`;";

// 上一版 patch（上海时间 空格格式 + cover + 无正文标题）
const IDX_PREV =
  'let p=new Date(Date.now()+8*60*60*1000),q=`${p.getUTCFullYear()}-${String(p.getUTCMonth()+1).padStart(2,"0")}-${String(p.getUTCDate()).padStart(2,"0")} ${String(p.getUTCHours()).padStart(2,"0")}:${String(p.getUTCMinutes()).padStart(2,"0")}`,m=st(i),h=`---\\ntitle: ${ot(n)}\\ndate: ${q}\\nupdated: ${q}\\ndescription: ""\\ntags: []\\n${m}\\ncover: ""\\n---\\n`;';

// 上版 patch（ISO +08:00 但无秒 — js-yaml 不识别为 timestamp）
const IDX_PREV_TZ =
  'let p=new Date(Date.now()+8*60*60*1000),q=`${p.getUTCFullYear()}-${String(p.getUTCMonth()+1).padStart(2,"0")}-${String(p.getUTCDate()).padStart(2,"0")}T${String(p.getUTCHours()).padStart(2,"0")}:${String(p.getUTCMinutes()).padStart(2,"0")}+08:00`,m=st(i),h=`---\\ntitle: ${ot(n)}\\ndate: ${q}\\nupdated: ${q}\\ndescription: ""\\ntags: []\\n${m}\\ncover: ""\\n---\\n`;';

// 最终模板（ISO 8601 含秒 :00+08:00 — js-yaml 可识别为 Date）
const IDX_FINAL =
  'let p=new Date(Date.now()+8*60*60*1000),q=`${p.getUTCFullYear()}-${String(p.getUTCMonth()+1).padStart(2,"0")}-${String(p.getUTCDate()).padStart(2,"0")}T${String(p.getUTCHours()).padStart(2,"0")}:${String(p.getUTCMinutes()).padStart(2,"0")}:00+08:00`,m=st(i),h=`---\\ntitle: ${ot(n)}\\ndate: ${q}\\nupdated: ${q}\\ndescription: ""\\ntags: []\\n${m}\\ncover: ""\\n---\\n`;';

// ═══════════════════════════════════════════════════════════
// api.mjs — dateStr 生成
// ═══════════════════════════════════════════════════════════

// 原始 hyc（仅日期，本地时区）
const API_DATE_OLD =
  '\tconst now = /* @__PURE__ */ new Date();\n\tconst dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;';

// 上一版 patch（上海时间 空格格式）
const API_DATE_PREV =
  '\tconst now = /* @__PURE__ */ new Date(Date.now()+8*60*60*1000);\n\tconst dateStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")} ${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;';

// 上版 patch（ISO +08:00 但无秒）
const API_DATE_PREV_TZ =
  '\tconst now = /* @__PURE__ */ new Date(Date.now()+8*60*60*1000);\n\tconst dateStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}T${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}+08:00`;';

// 最终版（ISO 8601 含秒 :00+08:00）
const API_DATE_FINAL =
  '\tconst now = /* @__PURE__ */ new Date(Date.now()+8*60*60*1000);\n\tconst dateStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}T${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}:00+08:00`;';

// ═══════════════════════════════════════════════════════════
// api.mjs — content 模板行
// ═══════════════════════════════════════════════════════════

// 原始（有 draft 和正文标题）
const API_CONTENT_OLD =
  '\tconst content = `---\\ntitle: ${toYamlQuoted(title)}\\ndate: ${dateStr}\\nupdated: ${dateStr}\\ndescription: ""\\ntags: []\\n${categoriesFrontmatter}\\ndraft: ${draft}\\n---\\n\\n# ${title}\\n\\n在这里开始写作...\\n`;';

// 最终（cover 替代 draft，移除正文标题和占位）
const API_CONTENT_NEW =
  '\tconst content = `---\\ntitle: ${toYamlQuoted(title)}\\ndate: ${dateStr}\\nupdated: ${dateStr}\\ndescription: ""\\ntags: []\\n${categoriesFrontmatter}\\ncover: ""\\n---\\n`;';

// ═══════════════════════════════════════════════════════════
// 执行
// ═══════════════════════════════════════════════════════════

const ROOT = resolve(import.meta.dirname, "..");
const BASE = "node_modules/@hyacine/cli/dist/bun";

const PATCHES: Patch[] = [
  // index.mjs — 原始 → 最终
  {
    file: `${BASE}/index.mjs`,
    old: IDX_ORIGINAL,
    new: IDX_FINAL,
    label: "index.mjs (原始 → 最终)",
  },
  // index.mjs — 空格格式 → 最终
  {
    file: `${BASE}/index.mjs`,
    old: IDX_PREV,
    new: IDX_FINAL,
    label: "index.mjs (空格 → +08:00 含秒)",
  },
  // index.mjs — +08:00 缺秒 → +08:00 含秒
  {
    file: `${BASE}/index.mjs`,
    old: IDX_PREV_TZ,
    new: IDX_FINAL,
    label: "index.mjs (+08:00 缺秒 → 含秒)",
  },
  // api.mjs dateStr — 原始 → 最终
  {
    file: `${BASE}/api.mjs`,
    old: API_DATE_OLD,
    new: API_DATE_FINAL,
    label: "api.mjs dateStr (原始 → +08:00 含秒)",
  },
  // api.mjs dateStr — 空格格式 → 最终
  {
    file: `${BASE}/api.mjs`,
    old: API_DATE_PREV,
    new: API_DATE_FINAL,
    label: "api.mjs dateStr (空格 → +08:00 含秒)",
  },
  // api.mjs dateStr — +08:00 缺秒 → +08:00 含秒
  {
    file: `${BASE}/api.mjs`,
    old: API_DATE_PREV_TZ,
    new: API_DATE_FINAL,
    label: "api.mjs dateStr (+08:00 缺秒 → 含秒)",
  },
  // api.mjs content — draft → cover
  {
    file: `${BASE}/api.mjs`,
    old: API_CONTENT_OLD,
    new: API_CONTENT_NEW,
    label: "api.mjs content (draft → cover)",
  },
];

let patched = 0;
for (const { file, old: OLD, new: NEW, label } of PATCHES) {
  const filePath = resolve(ROOT, file);
  let content: string;
  try {
    content = readFileSync(filePath, "utf8");
  } catch {
    console.log(`⏭  ${label}: 文件不存在`);
    continue;
  }

  if (content.includes(NEW)) {
    console.log(`✓ ${label}: 已是最新，跳过`);
    patched++;
    continue;
  }

  if (content.includes(OLD)) {
    content = content.replace(OLD, NEW);
    writeFileSync(filePath, content);
    console.log(`✅ ${label}: patch 完成`);
    patched++;
  } else {
    console.log(`⚠ ${label}: 未匹配到模板，请手动检查`);
  }
}

console.log(`\n完成: ${patched}/${PATCHES.length} 条 patch 已就绪`);
