# US Star Auto Sale — React (Vite)

Premium used-car dealership site for Knoxville, TN. Migrated from a static
multi-page HTML site to a React single-page app.

## Run

```bash
npm install
npm run dev      # dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Image optimization

Car photos in `public/assets/cars/` are recompressed in place. Originals are
backed up (gitignored) in `cars_original_backup/`.

```bash
npm run optimize-images
```

## Structure

- `src/pages/` — one component per route (Home, Inventory, CarDetail, …)
- `src/components/` — Header, Footer, Layout, CarCard, …
- `src/lib/` — data loading (`useCars`), favorites, Telegram form submit, helpers
- `src/css/` — original stylesheets + page-specific styles extracted from inline `<style>`
- `public/` — `cars.json`, images, icons, fonts (served at site root)
- `_legacy/` — the original static HTML/CSS/JS, kept for reference

## Notes

- Old `*.html?id=` links redirect to clean routes (e.g. `/car/5`).
- The Telegram bot token lives in the client bundle (same as the old site). Move
  it to a backend if you need it hidden. Override via `VITE_TG_BOT_TOKEN` /
  `VITE_TG_CHAT_ID` env vars.
