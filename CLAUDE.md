# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static website hosted at RandomizerTools.net — a hub of vanilla HTML/CSS/JS randomizer tools for games and hobbies. No build step or framework.

**Local development:** Because `script.js` uses `fetch()` to load `randomizer.json`, you must serve the project over HTTP — opening `index.html` directly via `file://` will fail with a CORS error. Use any static server (e.g. `python3 -m http.server` or VS Code Live Server).

**Deployment:** Push to the Netlify-connected repo. `_redirects` 301s the old `enigmamachinerandomizerhub.netlify.app` domain to `randomizertools.net`.

## Adding a New Randomizer

1. Create a new subdirectory: `RandomizerName/`
2. Use the standard file layout:
   ```
   RandomizerName/
   ├── index.html        # Structure only — link external CSS/JS
   ├── style.css         # All styling
   ├── script.js         # All behavior (loads randomizer.json via fetch)
   ├── randomizer.json   # Data
   ├── options.html      # Options page (use templates/options-clean.html as base)
   ├── options.css       # Options styles (or just link templates/options.css)
   └── options.js        # Options behavior (reads/writes localStorage)
   ```
3. Add a card for it in the root `index.html`
4. Add it to `templates/nav.html` (and `templates/navigation.html` if that is still in use) so the shared nav includes it

## randomizer.json Structure

```json
{
  "storageKey": "uniqueNameOptions",
  "sections": [
    {
      "name": "SectionName",
      "pickCount": 1,
      "items": ["Item A", "Item B", "Item C"]
    }
  ]
}
```

- `storageKey` — **must be unique** across all randomizers; `script.js` reads it and uses it as the `localStorage` key
- `pickCount` — how many items to pick from that section
- Items default to enabled; `options.js` saves per-section per-item booleans under the same key

`options.js` stores enabled state as `{ SectionName: { "Item A": true, "Item B": false, ... } }`.

## Navigation System (templates/)

`templates/nav-loader.js` is included in every page's `<head>`. It auto-detects directory depth, substitutes the `{{BASE_PATH}}` placeholder in `templates/nav.html`, and injects the nav bar into the DOM — no manual nav markup needed in individual pages.

| File | Purpose |
|---|---|
| `nav-loader.js` | Fetches and injects nav, handles depth detection |
| `nav.html` / `navigation.html` | Nav markup template with `{{BASE_PATH}}` placeholders |
| `nav-styles.css` | Shared nav styles |
| `nav-script.js` | Nav interactivity (mobile toggle etc.) |
| `options.css` | Shared options page styles |
| `options-clean.html` | Starter template for options pages (no inline styles) |
| `collapsible-options.js` | Shared accordion behavior for options pages |

**Python maintenance scripts** (`update_nav.py`, `update_navigation.py`, `update_css.py`, `cleanup_navigation.py`) — batch-update nav includes or shared CSS references across all randomizer subdirectories. Run them from the hub root when the shared nav template changes.

## Coding Rules (enforced by `_CODING_RULES.md`)

- **No inline styles** (`style="..."`) and no `<style>` tags in HTML — ever
- **No inline JS** — no `onclick="..."` attributes; no `<script>` blocks with code
- Use `addEventListener` (never `element.onclick = ...`)
- Manipulate state via CSS classes (`classList.add/remove/toggle`), not `element.style.*`
- Wrap all JS in `document.addEventListener('DOMContentLoaded', () => { ... })`
- Data in `randomizer.json`; fetch it with `fetch().then(res => res.json())`
- Responsive layout via CSS `@media` queries, not JavaScript

These rules exist to keep the codebase maintainable across dozens of standalone tools — no exceptions.
