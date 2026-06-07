/**
 * 拼接 BASE_URL（例如 /buggy-blog/）与相对路径。
 * import.meta.env.BASE_URL 始终以 "/" 结尾。
 */
export const BASE_URL: string = import.meta.env.BASE_URL || "/";

export function withBase(path: string): string {
  // BASE_URL 已带尾部斜杠，path 去掉前导斜杠以免双斜杠
  return `${BASE_URL}${path.replace(/^\//, "")}`;
}

/** 仅对内部路径添加 BASE_URL，外链（http(s)://）原样返回 */
export function maybeBase(href: string): string {
  if (/^https?:\/\//.test(href)) return href;
  return withBase(href);
}
