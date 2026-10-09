# Style Your Days

An Angular website for curated fashion inspiration. All four original pages, 28 outfit images and their Pinterest links are preserved. Galleries now include local search and responsive layouts.

## Development

Use Node 24.15+ (or a supported version listed in `package.json`).

```sh
npm ci
npm start
```

Open the development server on port 4200. Angular reloads when source files change. No database, API keys, or Express server are required.

```sh
npm run format:check
npm run typecheck
npm run build
npm test
```

`npm test` builds the app and runs browser checks against the production output. Set `CHROMIUM_PATH` to your Chromium executable (the cloud environment uses `/usr/bin/chromium`), or install Playwright Chromium with `npx playwright install chromium`.

## Organization

- `src/app/pages/`: lazy-loaded home, about, For You, latest trends, and not-found pages.
- `src/app/shared/`: reusable site header, social footer, and searchable outfit gallery.
- `src/app/data/outfits.ts`: curated collections and original Pinterest URLs.
- `src/app/models/`: typed outfit and collection contracts.
- `src/app/app.routes.ts`: routes and document titles.
- `src/styles.css`: global resets, accessibility helpers, and shared page layout. Components keep their own styles beside their templates.
- `public/images/`: original images, served unchanged.
- `tests/`: browser checks for navigation, gallery search, assets, and mobile layout.

The original URLs are `/`, `/about`, `/foryou`, and `/latesttrends`. Unknown routes show a not-found page. Search filters outfit titles and collection names locally; it does not contact Pinterest or a backend. Each outfit has a descriptive title used by search and image alternative text. Update `outfits.ts` when curating new outfits.

## Deployment

Run `npm run build` and serve `dist/styleyourdays/browser`. Configure the host to serve `index.html` for application routes so direct links and refreshes work. The included `netlify.toml` and `public/_redirects` configure this for Netlify. Images and compiled assets must be served as files.

The Angular app replaces the former Express/EJS runtime and Gulp configuration. Dependencies are installed from `package-lock.json`; generated `node_modules`, build output, and caches are ignored by Git.

## Open the project on your computer

1. Download this branch from GitHub with **Code → Download ZIP** and extract it.
2. Install Node.js 24 LTS and Visual Studio Code.
3. In VS Code choose **File → Open Folder** and select the extracted folder containing `package.json`.
4. Open **Terminal → New Terminal**, run `npm ci`, then run `npm start`.
5. Visit `http://localhost:4200` in your browser. Keep the terminal open. Press Ctrl+C to stop.

If port 4200 is occupied, run `npm start -- --port 4300` and visit `http://localhost:4300`. If PowerShell blocks `npm.ps1`, use a Command Prompt terminal in VS Code or run `npm.cmd ci` and `npm.cmd start` instead. You do not need to change your system execution policy.
