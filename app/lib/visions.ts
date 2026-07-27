// Browser-side vision toggle state (shared across pages via ?visions= URL param
// + localStorage). Ported from app.js. Functions touch window/document/location,
// so only call them inside effects / event handlers (never during SSR).

export function getActiveVisions(): string[] {
  const p = new URLSearchParams(location.search).get("visions");
  if (p !== null) return p ? p.split(",").filter(Boolean) : [];
  try {
    return JSON.parse(localStorage.getItem("visions") || "[]");
  } catch {
    return [];
  }
}

export function applyVisionClasses(list: string[]): void {
  const r = document.documentElement;
  Array.from(r.classList).forEach((c) => {
    if (c.indexOf("show-vision-") === 0) r.classList.remove(c);
  });
  list.forEach((id) => r.classList.add("show-vision-" + id));
}

export function syncVisionCheckboxes(list: string[]): void {
  document.querySelectorAll<HTMLInputElement>("input[data-vision]").forEach((b) => {
    b.checked = list.indexOf(b.getAttribute("data-vision")!) !== -1;
  });
}

// Toggle one vision based on the checkbox that changed (don't union all copies).
export function visionsAfterToggle(input: HTMLInputElement): string[] {
  const id = input.getAttribute("data-vision")!;
  const list = getActiveVisions().filter((v) => v !== id);
  if (input.checked) list.push(id);
  return list;
}

export function setActiveVisions(list: string[]): void {
  try {
    localStorage.setItem("visions", JSON.stringify(list));
  } catch {
    /* ignore */
  }
  const params = new URLSearchParams(location.search);
  if (list.length) params.set("visions", list.join(",")); else params.delete("visions");
  const qs = params.toString();
  history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  applyVisionClasses(list);
  syncVisionCheckboxes(list);
}
