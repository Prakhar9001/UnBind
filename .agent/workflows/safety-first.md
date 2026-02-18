---
description: Safety-first workflow for all code changes — local only, no git push
---

# Safety-First Code Change Protocol

## Rules
1. **NO GITHUB CHANGES** — Do NOT run `git commit`, `git push`, or modify `.git/`
2. **LOCAL ONLY** — Edit files in `d:/book_app/` only
3. **HOT RELOAD SAFE** — `npm run dev` must stay running
4. **BUILD TEST** — Run `npm run build` after changes, report 0 errors
5. **VISUAL VERIFY** — Confirm localhost:3000 is functional

## Workflow
1. Make the requested change (code/icon/branding/feature)
// turbo
2. Run `npm run build` — report errors if any
3. Tell user to test `localhost:3000` and approve
4. User manually handles: `git add .` → `git commit` → `git push`

## DO NOT
- ❌ `git commit` / `git push`
- ❌ Modify `.gitignore` or GitHub Actions
- ❌ Restart dev server without user OK
- ❌ Break existing functionality

## After Each Change Report
- ✅ What was changed
- ✅ `npm run build` status (0 errors?)
- ✅ localhost:3000 still working?
