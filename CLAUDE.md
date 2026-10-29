# AIP readiness assessment (client-facing) — working notes for Claude

This repo is **public**, and it is the site prospects and clients use. Keep internal sales
material, internal URLs and any secrets out of it entirely. Internal tooling lives in a separate
private repo with its own CLAUDE.md.

- Netlify site: `aip-readiness` → https://aip-readiness.netlify.app (production is public).
- Pages:
  - `index.html` — title `AIP readiness assessment — IFS Copperleaf`. Version in `APP_VERSION`
    and the `#ver` footer element; bump both on every change.
  - `data/index.html` — title `Data readiness assessment — IFS Copperleaf`. Version in
    `DAPP_VERSION` and `#ver`.
- `_redirects` — stops this file being served as a web page (the site publishes the repo root).
  Keep it.

## Hard rules

1. **Deploy only by git commit to `main`.** No drag-and-drop deploys in the Netlify dashboard.
2. **Before every commit, check each file's `<title>`.** An internal page must never be committed
   here; it has happened before via manual deploys.
3. **Never delete or rename form fields** without coordinating with the internal tooling that
   reads the submissions. Never delete form submissions.
4. **No secrets, keys or tokens** in this repo, ever. It is public.

## Forms (Netlify Forms, detected at deploy time from the hidden `<form>` in each page)

- `aip-assessment` (root page): `bot-field`, `token`, `sector`, `overall`, `domainLevels`,
  `answers`, `startedAt`, `durationSec`, `appVersion`, `owner`.
- `data-assessment` (`/data/`): `bot-field`, `token`, `owner`, `overallData`, `dataDomainLevels`,
  `dataAnswers`, `startedAt`, `durationSec`, `dataAppVersion`.

The hidden form and the JavaScript submission payload must list the same field names.

## Couplings

- Sector keys: `elec_na`, `gas_na`, `water_na`, `elec`, `gas`, `water`, `transport`, `other`.
  Adding, removing or renaming one needs the matching change in the internal tooling.
- Answers are decoded by question position. Changing questions, their order or option wording
  is a question-bank change: bump `APP_VERSION` and update the internal decoder in step.
- Links arrive as `?p=<token>&o=<owner>`; both values are submitted with the form.

## After every deploy, verify

1. Netlify shows a new ready deploy for the commit.
2. Live root and `/data/` pages show the expected `<title>` and footer version, and **no**
   "internal" banner.
3. `aip-assessment` and `data-assessment` are still registered with the fields above, and their
   submission counts have not dropped.
4. `https://aip-readiness.netlify.app/CLAUDE.md` returns 404.

## Known issues

- Copy still says "pound of spend" (question 1, top option; strategic domain, level-5 step).
  North American respondents see it; make it currency-neutral.
