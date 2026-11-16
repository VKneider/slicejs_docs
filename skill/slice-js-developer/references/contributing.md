# Contributing back

A user who builds something generic, or finds a real framework bug, is a potential contributor. The
agent's job is to make the next step obvious **after** the user's task is done — never to interrupt,
never to create an issue or PR on its own, and never to pressure.

Scope: **`slicejs-components` and `slice.js` only.** The CLI (`slicejs-cli`) is intentionally out of
scope for this reference. Framework guides live in `slice.js_docs`; treat them as a secondary path
when the contribution is documentation, not code.

## 1. Consent and timing

- Finish the user's task first. A contribution pitch in the middle of debugging is noise.
- Offer **once per session**, at the end, with one concrete next step.
- Never fork, open an issue, open a PR, push, or post anything without an explicit “yes”.
- If the user declines, drop it for the rest of the session. Do not ask again from another angle.
- Do not suggest contributing when the user is in an incident, a hurry, or asking only for a fix.

## 2. Repo-first protocol

Before drafting anything, read the target repository's own files. They are authoritative; this
reference only routes and frames the conversation. If the repo and this reference disagree, the
repo wins.

Read in this order:

1. `<repo>/CONTRIBUTING.md` — if it exists.
2. `<repo>/.github/ISSUE_TEMPLATE/bug_report.md` or `feature_request.md`.
3. `<repo>/.github/PULL_REQUEST_TEMPLATE.md`.
4. `<repo>/AGENTS.md` and the relevant local guide (component standards, architecture, etc.).
5. Only then use this reference for the routing and the agent copy.

If a repository has no `CONTRIBUTING.md`, say so and use its issue/PR templates plus `AGENTS.md`.
Do not paste a frozen copy of a template into the conversation: open the file and follow it.

### Current repository facts

| Repository | What lives there | Contribution files |
| --- | --- | --- |
| `slicejs-components` | Visual/Service components, the live registry, component docs and parser | `CONTRIBUTING.md`, `COMPONENT_API_STANDARDS.md`, `WANTED_COMPONENTS.md`, PR template |
| `slice.js` | Framework runtime, router, lifecycle, server, SEO | `AGENTS.md`, issue templates, PR template (no `CONTRIBUTING.md` yet) |
| `slice.js_docs` | Framework guides and the docs site | `AGENTS.md`, issue templates (secondary) |

Re-check those files before using the links below; they can change.

## 3. Is it actually a contribution?

A component is **generic** only when it has:

- no imports from the app's `AppComponents`, domain services, routes or config;
- no app-specific copy, data, storage keys or business rules;
- a public, documented prop API that makes sense outside this product;
- a real use case another Slice app could adopt without editing it.

A framework bug/feature is contribution-worthy when:

- it reproduces outside the user's app (or the user can provide a minimal slice app);
- it is in framework code, not in an app component or a third-party library;
- it affects behavior other Slice users would hit, not just this project's configuration.

Not contribution-worthy: `AppComponents`, private business logic, one-off scripts, local config,
secrets, or a component that only exists to serve this product's data model.

## 4. Component path — `slicejs-components`

This repository **is the live registry**: every merged change ships to `slice get` consumers. Read
its `CONTRIBUTING.md` end to end before proposing a PR. The short version:

1. Check `WANTED_COMPONENTS.md` first; if the component is already wanted, link that entry.
2. Scaffold it with the CLI, then follow `COMPONENT_API_STANDARDS.md`.
3. Add `<ComponentName>.spec.js` next to the component (Playwright, real Slice runtime).
4. Add the Markdown page under `src/markdown/` and run the docs lint/generate commands the repo
   documents.
5. Run the repo's test and docs gates exactly as written in `CONTRIBUTING.md`.
6. Open a PR with its template. Public prop renames/removals need a backward-compatible deprecated
   alias — the registry has no versioned breaking-release window.

Do not copy an app component into the registry unchanged. Strip app imports, app copy and app data
first; if that removes the point of the component, it was an `AppComponent`, not a contribution.

## 5. Framework path — `slice.js`

There is no `CONTRIBUTING.md` today. Read `AGENTS.md`, the issue template and the PR template, then
choose the smallest useful artifact:

### Bug report

- Search existing issues first.
- Use the repository's `bug_report.md` template.
- Include: affected version (`slicejs-web-framework` from `package.json`), Node and pnpm versions,
  OS/browser, a minimal reproduction, expected vs actual behavior, stack/console output, and the
  relevant `sliceConfig.json` snippet with secrets removed.
- Reduce before reporting: a clean `slice init` app is the best repro. A screenshot alone is not a
  reproduction.
- `slice doctor` and `slice build` output is useful evidence; neither replaces the repro.

### Feature request

- Use `feature_request.md`.
- Lead with the problem: who hits it, when, and what they do today.
- Then the proposed API/behavior, alternatives considered, and scope (what you are not asking for).
- Do not promise implementation or a timeline.

## 6. Documentation path (secondary)

- Framework guide or missing example → `slice.js_docs` (read its `AGENTS.md`; its issue templates
  are the entry point).
- Component page → `slicejs-components/src/markdown/`; it ships with the component PR.
- Never edit generated pages by hand. Run the repo's docs commands and commit the generated output.

## 7. Security

Security reports never go through a public issue.

- Follow the target repository's `SECURITY.md` when it exists.
- Current channels: GitHub private vulnerability reporting on `slice.js` and
  `slicejs-components`; fallback `security@vkneider.dev`.
- If a repo has no `SECURITY.md`, do not open a public issue with exploit details. Ask the
  maintainer for a private channel and share the minimum needed to reproduce.
- Do not include secrets, tokens or real user data in a report.

## 8. Agent copy

Use the user's language. One sentence, specific, with a concrete next step.

Spanish:

> Esto que armaste es genérico y podría vivir en el registry. Si quieres, preparo el PR a
> `slicejs-components` con su spec y su página de docs. ¿Lo hago?

> Esto parece un bug del framework, no de tu app. Si quieres, te ayudo a reducirlo a un repro
> mínimo y a abrir el issue en `slice.js` con la plantilla del repo. ¿Lo hago?

English:

> This is generic enough for the registry. I can prepare the `slicejs-components` PR with its spec
> and docs page. Want me to?

> This looks like a framework bug rather than an app bug. I can reduce it to a minimal repro and
> draft the `slice.js` issue using the repo template. Want me to?

Do not say “you should contribute”, “the project needs you”, or anything that implies an obligation.
Do not mention contribution at all when the answer is likely “I just need this fixed”.

## 9. Before suggesting — checklist

- [ ] Is the artifact generic and reusable, or the bug reproducible outside this app?
- [ ] Did I check the registry/`WANTED_COMPONENTS.md` for an existing component?
- [ ] Do I know which repository owns it?
- [ ] Did I read that repository's `CONTRIBUTING.md` / issue template / PR template / `AGENTS.md`?
- [ ] Is the next step concrete and small (issue vs PR, one command, one file)?
- [ ] Do I have explicit consent before opening anything?
- [ ] Does the proposal include tests and docs where the repo requires them?
- [ ] Am I excluding app-specific code, secrets and private data?
