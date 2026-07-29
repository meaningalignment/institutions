# Institutions

An interactive grid for exploring institutional design for AI governance. Maps institutional mechanisms (protocols, preferences, rights, incentives, expertise, norms, thick commitments) across scales (dyadic, group, community, national, global).

Three perspectives:

- **AGI Institutions** — new institutions needed for a world of autonomous AI agents
- **Existing Human Institutions** — current institutional infrastructure and how humans accomplish alignment
- **Fidelity & Meaning** — institutions to align organizations with rich, accountable mandates

Each grid cell expands to show detailed frameworks, and many include problem sets designed for pairs or small teams (~1 hour each).

## Contributing

Content lives in `data/{agi,human,fidelity}/` as markdown files named `{row}-{col}.md` (e.g. `dyadic-protocols.md`).

Each file follows this format:

```markdown
# Cell Title

Body content rendered in the detail view.

## Researchers

- [Name](url) — brief description of their work

## Key Papers

- [Paper title](url) (Year). Summary of relevance.

## Learning Resources

- [Resource title](url) — textbook, tutorial, course, etc.

## Problem Sets

### Problem 1: Name

Problem description and deliverables.
```

Cells can include any combination of these sections — all are optional. Use whatever standard markdown structure fits the content.

To add a new cell, create the markdown file and run `npm run build`. The grid links also point to GitHub for easy editing.

## Building Locally

```bash
npm install
npm run db:migrate:admin-auth
npm run build
```

The app uses React Router SSR. Copy `.env.example` to `.env` and provide the database
connection plus Mailgun/session settings before testing the authenticated `/admin` routes.

## Admin sign-in

The public site remains open. `/admin` is protected by passwordless email codes sent
through Mailgun to addresses already present in `researchers.email`. Codes expire after
10 minutes and successful verification creates an HttpOnly session cookie.

## Deployment

Hosted on Vercel. Push to `main` to deploy; Vercel runs the React Router build. Configure
the variables in `.env.example` in the Vercel project.
