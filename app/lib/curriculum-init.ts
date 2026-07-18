// Client-side curriculum interactivity, ported from build.cjs's inline IIFEs:
// (1) scrollspy that highlights the sidebar link for the section in view, and
// (2) the entry-axis pickers that re-rank fields when a problem/institution is
// chosen. Runs once after hydration; returns a cleanup for the observer.

export function initCurriculum(): () => void {
  const cleanups: Array<() => void> = [];

  // ── Scrollspy ────────────────────────────────────────────────────
  (function () {
    const links = document.querySelectorAll<HTMLAnchorElement>(".curr-sidebar-link");
    if (links.length && "IntersectionObserver" in window) {
      const visible = new Set<string>();
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) visible.add((e.target as HTMLElement).id);
            else visible.delete((e.target as HTMLElement).id);
          });
          const sections = Array.from(document.querySelectorAll<HTMLElement>(".curr-field"));
          let current: string | null = null;
          for (let i = 0; i < sections.length; i++) {
            if (visible.has(sections[i].id)) {
              current = sections[i].id;
              break;
            }
          }
          links.forEach((a) => {
            a.classList.toggle("is-active", a.dataset.target === current);
          });
        },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
      );
      document.querySelectorAll<HTMLElement>(".curr-field").forEach((s) => io.observe(s));
      cleanups.push(() => io.disconnect());
    }
  })();

  // ── Entry-axis pickers ───────────────────────────────────────────
  (function () {
    const blob = document.getElementById("curr-theme-map");
    const container = document.getElementById("curr-fields");
    const tiles = Array.from(document.querySelectorAll<HTMLElement>(".curr-picker-tile"));
    const resetBtn = document.getElementById("curr-picker-reset");
    const pickers = document.getElementById("curr-pickers");
    const changeBtn = document.getElementById("curr-picker-change");
    const pickerDetails = pickers
      ? Array.from(pickers.querySelectorAll<HTMLDetailsElement>("details.curr-picker"))
      : [];
    if (!blob || !container || !tiles.length) return;

    function collapsePickers(on: boolean) {
      if (!pickers) return;
      pickers.classList.toggle("is-collapsed", !!on);
      if (on) pickerDetails.forEach((d) => (d.open = false));
    }

    let DATA: any;
    try {
      DATA = JSON.parse(blob.textContent || "{}");
    } catch {
      return;
    }
    const THEMES = DATA.themes || {};
    const CELLS = DATA.cells || {};

    const originalOrder = Array.from(container.querySelectorAll<HTMLElement>(".curr-field"));
    const byField: Record<string, HTMLElement> = {};
    originalOrder.forEach((el) => (byField[el.dataset.field!] = el));

    const sidebarList = document.querySelector(".curr-sidebar-list");
    const sidebarLinks: Record<string, HTMLElement> = {};
    const sidebarItems: Record<string, HTMLElement> = {};
    Array.from(document.querySelectorAll<HTMLElement>(".curr-sidebar-link")).forEach((a) => {
      sidebarLinks[a.dataset.target!] = a;
      sidebarItems[a.dataset.target!] = a.parentNode as HTMLElement;
    });
    const sidebarOriginal = sidebarList ? Array.from(sidebarList.children) : [];

    function renumber() {
      const ordered = Array.from(container!.querySelectorAll<HTMLElement>(".curr-field"));
      let n = 0;
      ordered.forEach((el) => {
        const num = el.classList.contains("is-dimmed") ? "" : String(++n);
        const fnum = el.querySelector(".curr-field-num");
        if (fnum) fnum.textContent = num;
        const fid = el.dataset.field!;
        const snum = sidebarLinks[fid] && sidebarLinks[fid].querySelector(".curr-sidebar-num");
        if (snum) snum.textContent = num || "·";
      });
    }

    function clearInjected() {
      container!.querySelectorAll(".curr-gain").forEach((n) => n.remove());
      const divider = container!.querySelector(".curr-other-divider");
      if (divider) divider.remove();
      originalOrder.forEach((el) => el.classList.remove("is-relevant", "is-dimmed"));
    }

    const chip = document.getElementById("curr-selection-chip");
    const chipKind = chip && chip.querySelector(".curr-selection-chip-kind");
    const chipLabel = chip && chip.querySelector(".curr-selection-chip-label");
    const chipX = chip && chip.querySelector(".curr-selection-chip-x");

    function setChip(kind: string | null, label?: string) {
      if (!chip) return;
      if (!kind) {
        (chip as HTMLElement).hidden = true;
        return;
      }
      if (chipKind) chipKind.textContent = kind === "institution" ? "Institution" : "Problem";
      if (chipLabel) chipLabel.textContent = label || "";
      (chip as HTMLElement).hidden = false;
    }

    function setUrl(kind: string | null, id?: string) {
      if (!window.history || !window.history.replaceState) return;
      const url = new URL(window.location.href);
      url.searchParams.delete("problem");
      url.searchParams.delete("institution");
      if (kind && id) url.searchParams.set(kind, id);
      window.history.replaceState(null, "", url.toString());
    }

    function reset(skipUrl?: boolean) {
      clearInjected();
      originalOrder.forEach((el) => container!.appendChild(el));
      if (sidebarList) sidebarOriginal.forEach((li) => sidebarList.appendChild(li));
      tiles.forEach((t) => t.classList.remove("is-active"));
      sidebarOriginal.forEach((li) => (li as HTMLElement).classList.remove("is-dimmed"));
      renumber();
      if (resetBtn) (resetBtn as HTMLElement).hidden = true;
      collapsePickers(false);
      setChip(null);
      if (!skipUrl) setUrl(null);
    }

    function rankingForTheme(themeId: string) {
      const t = THEMES[themeId];
      return t ? { fields: t.fields.slice() } : null;
    }
    function rankingForCell(cellId: string) {
      const c = CELLS[cellId];
      if (!c) return null;
      const seen: Record<string, boolean> = {};
      const fields: any[] = [];
      c.themes.forEach((tid: string) => {
        const t = THEMES[tid];
        if (!t) return;
        t.fields.forEach((f: any) => {
          if (seen[f.id]) return;
          seen[f.id] = true;
          fields.push(f);
        });
      });
      return { fields };
    }

    function applyRanking(ranking: { fields: any[] } | null) {
      if (!ranking || !ranking.fields.length) return;
      clearInjected();

      const relevantSet: Record<string, boolean> = {};
      ranking.fields.forEach((f) => (relevantSet[f.id] = true));

      ranking.fields.forEach((f) => {
        const el = byField[f.id];
        if (!el) return;
        el.classList.add("is-relevant");
        el.classList.remove("is-dimmed");
        if (!(el as HTMLDetailsElement).open) (el as HTMLDetailsElement).open = true;
        const body = el.querySelector(".curr-field-body");
        if (body) {
          const gain = document.createElement("div");
          gain.className = "curr-gain";
          const glabel = document.createElement("span");
          glabel.className = "curr-gain-label";
          glabel.textContent = "What you’ll gain";
          gain.appendChild(glabel);
          const gtext = document.createElement("span");
          gtext.className = "curr-gain-text";
          gtext.textContent = f.bridge;
          gain.appendChild(gtext);
          body.insertBefore(gain, body.firstChild);
        }
        container!.appendChild(el);
        if (sidebarList && sidebarItems[f.id]) {
          sidebarItems[f.id].classList.remove("is-dimmed");
          sidebarList.appendChild(sidebarItems[f.id]);
        }
      });

      const divider = document.createElement("div");
      divider.className = "curr-other-divider";
      divider.innerHTML = "<span>Other fields</span>";
      container!.appendChild(divider);

      originalOrder.forEach((el) => {
        if (relevantSet[el.dataset.field!]) return;
        el.classList.add("is-dimmed");
        el.classList.remove("is-relevant");
        (el as HTMLDetailsElement).open = false;
        container!.appendChild(el);
        if (sidebarList && sidebarItems[el.dataset.field!]) {
          sidebarItems[el.dataset.field!].classList.add("is-dimmed");
          sidebarList.appendChild(sidebarItems[el.dataset.field!]);
        }
      });

      renumber();
      if (resetBtn) (resetBtn as HTMLElement).hidden = false;
    }

    function select(kind: string, id: string, skipUrl?: boolean) {
      let ranking: { fields: any[] } | null;
      let label: string;
      if (kind === "problem") {
        const t = THEMES[id];
        if (!t) return false;
        ranking = rankingForTheme(id);
        label = t.label;
      } else if (kind === "institution") {
        const c = CELLS[id];
        if (!c) return false;
        ranking = rankingForCell(id);
        label = c.label;
      } else {
        return false;
      }
      if (!ranking || !ranking.fields.length) return false;
      applyRanking(ranking);
      const attr = kind === "problem" ? "theme" : "cell";
      tiles.forEach((o) => o.classList.toggle("is-active", o.dataset[attr] === id));
      setChip(kind, label);
      collapsePickers(true);
      if (!skipUrl) setUrl(kind, id);
      return true;
    }

    tiles.forEach((t) => {
      const handler = () => {
        if (t.classList.contains("is-active")) {
          reset();
          return;
        }
        select(t.dataset.theme ? "problem" : "institution", (t.dataset.theme || t.dataset.cell)!);
      };
      t.addEventListener("click", handler);
      cleanups.push(() => t.removeEventListener("click", handler));
    });
    if (resetBtn) {
      const h = () => reset();
      resetBtn.addEventListener("click", h);
      cleanups.push(() => resetBtn.removeEventListener("click", h));
    }
    if (chipX) {
      const h = () => reset();
      chipX.addEventListener("click", h);
      cleanups.push(() => chipX.removeEventListener("click", h));
    }
    if (changeBtn) {
      const h = () => {
        collapsePickers(false);
        const active = pickers && pickers.querySelector(".curr-picker-tile.is-active");
        const host = active && active.closest("details.curr-picker");
        (host ? [host as HTMLDetailsElement] : pickerDetails).forEach((d) => (d.open = true));
      };
      changeBtn.addEventListener("click", h);
      cleanups.push(() => changeBtn.removeEventListener("click", h));
    }

    (function () {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("problem");
      const inst = params.get("institution");
      if (p) {
        if (!select("problem", p, true)) setUrl(null);
      } else if (inst) {
        if (!select("institution", inst, true)) setUrl(null);
      }
    })();
  })();

  return () => cleanups.forEach((fn) => fn());
}
