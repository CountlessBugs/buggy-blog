import { BASE_URL } from "@/toolkit/path";

function trimSlashes(input: string): string {
  return input.replaceAll(/^\/+|\/+$/g, "");
}

function removeMarkdownExtension(input: string): string {
  return input.replace(/\.mdx?$/i, "");
}

function encodePathSegments(input: string): string {
  return input
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function toTagSlug(name: string): string {
  const normalized = (name || "").trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  return normalized
    .replaceAll(/[\\/]+/g, "-")
    .replaceAll(/\s+/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-|-$/g, "");
}

export function toTagHref(name: string): string {
  const slug = toTagSlug(name);
  return slug ? `${BASE_URL}tags/${encodeURIComponent(slug)}/` : `${BASE_URL}tags/`;
}

export function toCategoryHref(name: string): string {
  const normalized = (name || "").trim();
  return normalized
    ? `${BASE_URL}categories/${encodeURIComponent(normalized)}/`
    : `${BASE_URL}categories/`;
}

export function toPostHref(idOrSlug: string): string {
  const normalized = trimSlashes(removeMarkdownExtension((idOrSlug || "").trim()));

  if (!normalized) {
    return `${BASE_URL}posts/`;
  }

  return `${BASE_URL}posts/${encodePathSegments(normalized)}/`;
}
