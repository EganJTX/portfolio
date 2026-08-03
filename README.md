# Jay Egan — Portfolio

Shell/orchestrator site for eganjtx.github.io/portfolio. Static HTML/CSS/JS, no build step,
no app code. Each project it links to lives in its own standalone repo with its
own GitHub Pages demo.

## Structure

```
index.html            Home (hero + project grid)
about.html             About
project.html            Reusable project detail template, driven by ?slug=
css/tokens.css          Brand tokens (colors, fonts) as CSS custom properties
css/styles.css           Site styles
js/main.js                Renders the project grid and project detail pages from data/
data/projects/index.json    List of project slugs shown on the home grid
data/projects/<slug>.json    One file per project, schema below
assets/logo.svg             Brandmark, color driven by CSS (inlined in each page header)
assets/screenshots/          Project screenshot images, referenced by filename in project JSON
```

## Adding a new project

1. Finish that project's own repo (de-identified demo, GitHub Pages enabled).
2. Drop screenshot images into `assets/screenshots/`.
3. Add `data/projects/<slug>.json` with this shape:

```json
{
  "slug": "job-tracker",
  "title": "Job Tracker",
  "teaser": "One line, shows on the home card.",
  "screenshots": ["job-tracker-1.png", "job-tracker-2.png"],
  "demoUrl": "https://eganjtx.github.io/job-tracker",
  "repoUrl": "https://github.com/eganjtx/job-tracker",
  "sections": {
    "problem": "...",
    "build": "...",
    "technical": "...",
    "learning": "...",
    "next": "..."
  }
}
```

4. Add the slug to `data/projects/index.json`.

No other file needs to change. `project.html` renders whatever slug is in the URL.

## Theme

Colors and fonts are CSS custom properties in `css/tokens.css`. The file
default is the Slate palette; an Evergreen alternate is commented in the same
file, ready to swap in once exact hex values are confirmed.

## Local preview

No build step. Serve the folder with any static server, e.g.:

```
npx http-server .
```

Opening `index.html` directly by double-clicking also works for Home and
About, but `project.html` and the home grid fetch JSON via `fetch()`, which
some browsers block on the `file://` protocol — use a local server for those.
