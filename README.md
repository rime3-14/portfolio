# Rime / Software Engineering Portfolio

An editorial portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS, and original SVG diagrams. The expression compiler runs entirely in the browser.

## Local development

Use Node.js 22.18 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To preview the production export, run `npm run build` and then `npm run preview`.

```sh
npm run lint
npm test
npm run build
npm run typecheck
```

## GitHub Pages

The portfolio is published at [rime3-14.github.io/portfolio](https://rime3-14.github.io/portfolio/). The workflow in `.github/workflows/pages.yml` builds and deploys changes pushed to `main`. The repository uses **GitHub Actions** as its Pages source.

The build exports the full site to `out/`. The export includes `.nojekyll` and directory indexes for direct links to case studies, notes, and the compiler.

For a repository site such as `https://USERNAME.github.io/REPOSITORY/`, set these build-time variables in your Pages build:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://USERNAME.github.io` |
| `NEXT_PUBLIC_BASE_PATH` | `/REPOSITORY` |

For a user site or custom domain hosted at the root, leave the base path unset. Set the origin to the final HTTPS origin. Run `npm ci` and `npm run build`, then upload `out/` as the GitHub Pages artifact. See [GitHub’s Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). The preview server accepts the same base path and an optional `PORT`.

## Content to complete before publication

| File | Details to supply |
| --- | --- |
| `src/content/site.ts` | GitHub, LinkedIn, contact email, and CV. Add a local CV to `public/` and set `contact.cv` to its root-relative path. |
| `src/content/projects.ts` | Verified dates, approved project repository and demo links, and permitted technical details or results. |
| `src/content/notes.ts` | Review the two starter essays and add publication dates when set. |

The Work index and case studies share the project data in `src/content/projects.ts`. Add each new project there and set its optional `github`, `demo`, and `year` fields when available. The Lab registry is in `src/content/lab.ts`.

