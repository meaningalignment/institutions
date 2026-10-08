# Institutions

An interactive grid for exploring institutional design for AI governance. Maps institutional mechanisms (protocols, preferences, rights, incentives, expertise, norms, thick commitments) across scales (dyadic, group, community, national, global).

Three perspectives:

- **AGI Institutions** — new institutions needed for a world of autonomous AI agents
- **Existing Human Institutions** — current institutional infrastructure and how humans accomplish alignment
- **Fidelity & Meaning** — institutions to align organizations with rich, accountable mandates

Each grid cell expands to show detailed frameworks, and many include design challenges for pairs or small teams (~1 hour each).

## Suggesting reading for Resources

The [Resources](https://www.agi-institutions.org/resources/) page is built from the Markdown files in [`data/resources/`](data/resources), one file per research field. Anyone can suggest changes.

**Just want to suggest something?** [Open an issue](https://github.com/meaningalignment/institutions/issues/new?title=Resource%20suggestion) with the link and the field it belongs in.

**Want to add it yourself?**

1. Open the field's file in [`data/resources/`](data/resources), e.g. [`legal-theory.md`](data/resources/legal-theory.md).
2. Click the pencil icon to edit it on GitHub.
3. Copy an existing entry, paste it where you want yours to appear, and fill it in.
4. Click **Commit changes…** and then **Propose changes** to open a pull request.

A maintainer reviews the pull request. Once it's merged, the site updates.

### What an entry looks like

```markdown
- [Legal Infrastructure for Transformative AI Governance](https://arxiv.org/abs/2602.01474)
  - Authors: Gillian Hadfield
  - Year: 2026
  - Venue: PNAS
  - Type: Peer-reviewed
  - Cells: national-protocols, national-rights, global-protocols
  - Summary: Shifts attention from choosing rules to building legal systems that can generate and implement rules for frontier models and autonomous agents.
```

The first line, the title and link, is required. Every other line is optional.

| Detail | What to write |
| --- | --- |
| Authors | Names separated by commas, in the paper's order. End with `et al.` if you cut the list short. |
| Year | Four digits. |
| Venue | Journal, conference or publisher, e.g. `PNAS` or `ICLR 2026`. |
| Type | One of: Peer-reviewed, Preprint, Workshop paper, Essay, Report, Book, Book chapter, Lecture. |
| Cells | The grid cells the work bears on, named like the files in [`data/cells/`](data/cells) without `.md` (e.g. `group-norms`). These decide which fields the grid points to. |
| Summary | One sentence on what the work argues or shows. It appears under **Selected papers**. |

### Where it goes

- Each field file has three sections. **Selected papers** are the must-reads, **Work in the field** is recent work worth knowing, and **Foundations** is older work the field builds on. Put the entry under the right `##` heading.
- Entries appear on the site in the order they're listed in the file, so put the most important first.
- If a work belongs to several fields, add it to each field's file.
- To take a work off the site, delete its entry. To hide it but keep it in the file, wrap it in `<!--` and `-->`.

### Other files

- The top of each field file holds the field's details: its `curator`, a one-line `curator_bio`, the `email` that readers can write to, and the field's one-sentence description under the title.
- [`elsewhere.md`](data/resources/elsewhere.md) lists reading lists maintained by others, with `By:` and `Note:` lines instead.
- [`people.md`](data/resources/people.md) links author and curator names to their X profiles. Add a line to link a name everywhere it appears.

If an entry has a mistake, such as a misspelled cell name or a missing link, the deploy check on the pull request fails and names the file and line to fix. To check locally, run `npm run build`.

## Editing the grid

Each cell lives in `data/cells/{row}-{col}.md` (e.g. `dyadic-norms.md`). [CLAUDE.md](CLAUDE.md) documents the format and [STANDARDS.md](STANDARDS.md) the quality bar.

## Building locally

```bash
npm install
npm run db:migrate:admin-auth
npm run dev
```

`npm run dev` serves the site at http://localhost:5173/ and reloads when files under `data/` change. `npm run build` makes a production build.

The app uses React Router SSR. Copy `.env.example` to `.env` and provide the database
connection plus Mailgun/session settings before testing the authenticated
`/researchers/admin` routes. The grid, cell pages and Resources need no database.

## Admin sign-in

The public site remains open. `/researchers/admin` is protected by passwordless email codes sent
through Mailgun to addresses already present in `researchers.email`. Codes expire after
10 minutes and successful verification creates an HttpOnly session cookie.

## Deployment

Hosted on Vercel. Push to `main` to deploy; Vercel runs the React Router build. Configure
the variables in `.env.example` in the Vercel project.
