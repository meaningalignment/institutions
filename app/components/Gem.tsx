import type { ReactNode } from "react";

function hue(slug: string) {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 360;
}

/** A small cut-gem glyph, coloured per gem so the same virtue always looks the same. */
export function GemGlyph({ slug, size = 14 }: { slug: string; size?: number }) {
  const h = hue(slug);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M4 2h8l3 4-7 8-7-8z" fill={`hsl(${h} 65% 55%)`} />
      <path d="M1 6h14L8 14z" fill={`hsl(${h} 60% 42%)`} />
      <path d="M4 2l1.5 4L8 2l2.5 4L12 2" fill="none" stroke={`hsl(${h} 80% 80%)`} strokeWidth="0.8" />
      <path d="M5.5 6L8 14l2.5-8" fill="none" stroke={`hsl(${h} 70% 70%)`} strokeWidth="0.6" />
    </svg>
  );
}

export function GemChip({
  slug,
  name,
  description,
  pending = false,
  selected,
  onClick,
  children,
}: {
  slug: string;
  name: string;
  description?: string;
  pending?: boolean;
  /** When set, the chip is a toggle button. */
  selected?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm leading-tight";
  const style = pending ? " border-dashed" : "";
  const title = [description, pending ? "(awaiting approval)" : ""].filter(Boolean).join(" ");
  const content = (
    <>
      <GemGlyph slug={slug} />
      <span>{name}</span>
      {children}
    </>
  );
  if (selected === undefined) {
    return (
      <span
        className={`${base}${style} border-[color:var(--line-strong)] text-[color:var(--ink)]`}
        title={title || undefined}
      >
        {content}
      </span>
    );
  }
  return (
    <button
      type="button"
      aria-pressed={selected}
      title={title || undefined}
      onClick={onClick}
      className={`${base}${style} ${
        selected
          ? "border-[color:var(--ink)] bg-[var(--wash)] font-medium text-[color:var(--ink)] ring-1 ring-[color:var(--ink)]"
          : "border-[color:var(--line-strong)] text-[color:var(--muted)] hover:bg-[var(--wash)]"
      }`}
    >
      {content}
    </button>
  );
}
