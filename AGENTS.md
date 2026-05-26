# AGENTS.md

## Project Overview

Vigen.io is a web-based AI video platform specialized in **brainrot content** (viral TikTok formats like "tung tung sahur"). The product targets international users (English language) and aims to provide:

1. A high-class landing page
2. A video creation tool with **brainrot character template categories**
3. An **AI Generation hub** integrating APIs from Kling, Sora, Nano, Banana Pro, etc. for user-directed AI video production

The current state is an MVP prototype — a static client-side demo with no backend, no build system, and no external dependencies.

## Cursor Cloud specific instructions

### Running the application

The prototype is a static site (HTML/CSS/JS only). Serve it with:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

### Key facts

- **No package manager or build step** — there is no `package.json`, no `node_modules`, no bundler.
- **No backend** — all "AI" results are simulated client-side with hardcoded templates in `app.js`.
- **No linting or test framework configured** — the codebase is vanilla HTML/CSS/JS with no tooling.
- **Feature branch note** — the `main` branch may only contain a README; the actual prototype lives on feature branches (e.g. `cursor/vigen-mvp-prototype-3c90`). Always check available branches with `git branch -a`.

### Testing

Since there is no test framework, validate changes by:
1. Serving the site with `python3 -m http.server 8000`
2. Opening `http://localhost:8000` in Chrome
3. Interacting with the Creator Studio form (submit the form with different input types and verify the output panel updates correctly)

### Lint / Format

No lint or format tools are currently configured. For HTML/CSS/JS validation, use browser DevTools console to check for runtime errors.
