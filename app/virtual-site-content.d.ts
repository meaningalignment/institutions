declare module "virtual:site-content" {
  interface SiteContent {
    /** Cell markdown, keyed by filename stem ("{row}-{col}"). */
    cells: Record<string, string>;
    /** Method markdown, keyed by column id. */
    methods: Record<string, string>;
    /** Root data files (curriculum.md, theory-of-change.md, *.yaml), keyed by full filename. */
    root: Record<string, string>;
  }
  const content: SiteContent;
  export default content;
}
