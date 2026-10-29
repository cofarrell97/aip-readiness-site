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
  - `data-request.html` / `data-request.pdf` — title `Data request — IFS Copperleaf`. The
    prospect-facing request for sample data, sent after the EO (before the data readiness
    questions). The PDF is generated from the HTML: edit the HTML, then rebuild with
    `node tools/build-data-request.js data-request.html data-request.pdf` (setup in the script's
    header comment) and commit both.
- `_redirects` — stops this file, `tools/` and `.gitignore` being served (the site publishes the
  repo root). Keep it.

## Hard rules

1. **Deploy only by git commit to `main`.** No drag-and-drop deploys in the Netlify dashboard.
2. **Before every commit, check each file's `<title>`.** An internal page must never be committed
   here; it has happened before via manual deploys.
3. **Never delete or rename form fields** without coordinating with the internal tooling that
   reads the submissions. Never delete form submissions.
4. **No secrets, keys or tokens** in this repo, ever. It is public.

## Forms (Netlify Forms, detected at deploy time from the hidden `<form>` in each page)

- `aip-assessment` (root page): `bot-field`, `token`, `sector`, `overall`, `domainLevels`,
  `answers`, `startedAt`, `durationSec`, `appVersion`, `owner`, and since v2.0 `respondentName`,
  `respondentTitle`, `respondentOrg`, `respondentUnit`, `respondentDate`, `comment1` … `comment14`.
  `respondentEmail` existed in v2.0–v2.1 only and was removed in v2.2 (we already hold the
  contact's email; don't collect it again). Comments and respondent fields are collapsed to one line before submit
  (the Hub parses `field: value` lines).
- `data-assessment` (`/data/`): `bot-field`, `token`, `owner`, `overallData`, `dataDomainLevels`,
  `dataAnswers`, `startedAt`, `durationSec`, `dataAppVersion`.

The hidden form and the JavaScript submission payload must list the same field names.

## Couplings

- Sector keys: `elec_na`, `gas_na`, `water_na`, `elec`, `gas`, `water`, `transport`, `other`.
  Adding, removing or renaming one needs the matching change in the internal tooling.
- Answers are decoded by question position. Changing questions, their order or option wording
  is a question-bank change: bump `APP_VERSION` and update the internal decoder in step.
- Question bank v2.0 (14 questions, 8 areas = groups G1–G8 of the detailed maturity assessment) is
  word for word the 14 core (◆) questions of the detailed assessment, so the Hub can pre-fill it.
  Exception: v2.3 reworded Q6 (G3.3) to "How are alternatives, such as replace and refurbish, and a
  do-nothing option evaluated for each investment?"; the detailed assessment document needs the
  same wording. Answer options are unchanged. Each option shows its level ("Level 1" … "Level 5").
  Do not reword a question or option, or add per-sector option text, without changing the detailed
  assessment too. `domainLevels` keys: `strategy_value`, `risk_quant`, `inv_governance`,
  `portfolio_mgmt`, `budget_funding`, `plan_defence`, `asset_risk`, `asset_strategy`.
- Level names (Ad hoc, Emerging, Defined, Integrated, Optimized) match the detailed assessment, on
  both pages.
- Links arrive as `?p=<token>&o=<owner>&s=<sector key>`; all three are submitted with the form.
  Since v2.3 the prospect is not asked for their sector: it comes from `s` (set by the Hub when the
  link is minted). Without a valid `s`, `sector` is submitted blank and the results use the
  generic (`other`) framing.

## After every deploy, verify

1. Netlify shows a new ready deploy for the commit.
2. Live root and `/data/` pages show the expected `<title>` and footer version, and **no**
   "internal" banner.
3. `aip-assessment` and `data-assessment` are still registered with the fields above, and their
   submission counts have not dropped.
4. `https://aip-readiness.netlify.app/CLAUDE.md` returns 404.

## Known issues

- None open. ("Pound of spend" was removed with question bank v2.0.)
