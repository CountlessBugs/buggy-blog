/**
 * Patch hyc new 的 frontmatter 模板，对齐 ShokaX 官方格式。
 * 每次 `bun install` 后需要重跑: bun run scripts/patch-hyc.ts
 */
import { readFileSync, writeFileSync } from "fs";

const TARGETS = [
  "node_modules/@hyacine/cli/dist/bun/index.mjs",
  "node_modules/@hyacine/cli/dist/bun/api.mjs",
];

const OLD_TEMPLATE =
  "let p=new Date().toISOString(),m=st(i),h=`---\\ntitle: ${ot(n)}\\ndate: ${p}\\ndraft: ${r}\\n${m}\\n---\\n\\n# ${n}\\n\\n在这里开始写作...\\n`;";

const NEW_TEMPLATE =
  'let p=new Date(),q=`${p.getFullYear()}-${String(p.getMonth()+1).padStart(2,"0")}-${String(p.getDate()).padStart(2,"0")}T${String(p.getHours()).padStart(2,"0")}:${String(p.getMinutes()).padStart(2,"0")}:${String(p.getSeconds()).padStart(2,"0")}`,m=st(i),h=`---\\ntitle: ${ot(n)}\\ndate: ${q}\\nupdated: ${q}\\ndescription: ""\\ntags: []\\n${m}\\ndraft: ${r}\\n---\\n\\n# ${n}\\n\\n在这里开始写作...\\n`;';

let patched = 0;
for (const rel of TARGETS) {
  const filePath = `d:/Projects/Blog/buggy-blog/${rel}`;
  let content: string;
  try {
    content = readFileSync(filePath, "utf8");
  } catch {
    console.log(`⏭  ${rel} 不存在，跳过`);
    continue;
  }

  if (content.includes(NEW_TEMPLATE)) {
    console.log(`✓ ${rel} 已 patch，跳过`);
    patched++;
    continue;
  }

  if (content.includes(OLD_TEMPLATE)) {
    content = content.replace(OLD_TEMPLATE, NEW_TEMPLATE);
    writeFileSync(filePath, content);
    console.log(`✅ ${rel} patch 完成`);
    patched++;
  } else if (content.includes("在这里开始写作")) {
    console.log(`⚠ ${rel}: 找到模板但格式不匹配（版本可能不同），请手动检查`);
  } else {
    console.log(`⚠ ${rel}: 未找到模板字符串`);
  }
}

console.log(`\n完成: ${patched}/${TARGETS.length} 个文件已 patch`);
