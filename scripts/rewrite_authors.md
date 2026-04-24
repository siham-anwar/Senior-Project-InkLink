# Rewrite commit authors on `main` + `dev`

This repo includes `scripts/rewrite_authors.py` to rewrite commits authored/committed by **Nebil** to other identities (**Siham**, **Ezedin**, **Nezif**) using `git-filter-repo`.

## WARNING

- This **rewrites history**. Commit SHAs will change.
- You must **force-push** `main` and `dev`.
- Everyone else must **rebase/reset** or re-clone.
- Do this only after the team agrees and nobody is pushing.

## Install `git-filter-repo`

- macOS: `brew install git-filter-repo`
- Debian/Ubuntu: `sudo apt install git-filter-repo`
- Alternative: `pipx install git-filter-repo`

## Run (preview first)

From the repo root:

1) Preview how commits will be assigned (no rewrite):
   - `python3 scripts/rewrite_authors.py --preview`

2) Rewrite history on `main` and `dev`:
   - `python3 scripts/rewrite_authors.py --apply`

## Push rewritten branches

After `--apply` succeeds:

- `git push --force-with-lease origin main`
- `git push --force-with-lease origin dev`

## Teammates: how to sync after rewrite

Each teammate should:

- `git fetch origin`
- `git checkout main`
- `git reset --hard origin/main`
- `git checkout dev`
- `git reset --hard origin/dev`

