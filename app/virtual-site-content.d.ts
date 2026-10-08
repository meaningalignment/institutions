declare module "virtual:site-content" {
  interface SiteContent {
    /** Cell markdown, keyed by filename stem ("{row}-{col}"). */
    cells: Record<string, string>;
    /** Method markdown, keyed by column id. */
    methods: Record<string, string>;
    /** Root data files (theory-of-change.md, human-institutions.json), keyed by full filename. */
    root: Record<string, string>;
    /** The /resources reading lists from data/resources/, parsed at build time. */
    resources: import("./lib/resources").Resources;
  }
  const content: SiteContent;
  export default content;
}
