#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shlex
import subprocess
import sys
from dataclasses import dataclass


@dataclass(frozen=True)
class Identity:
    name: str
    email: str


SIHAM = Identity(name="Siham Anwar", email="sihamanwar687@gmail.com")
EZEDIN = Identity(name="Ezedin Kedir", email="ezexkedir21@gmail.com")
NEZIF = Identity(name="Nezif", email="nezif223@gmail.com")


DEFAULT_FROM_EMAILS = [
    # Nebil (provided)
    "nebilesmaelprog@gmail.com",
    # Common accidental config seen in this repo
    "nebil@example.com",
]

DEFAULT_FROM_NAMES = [
    "nebilesmaelsuleyman",
    "nebil esmael",
    "nebil",
    "nebil esma",
    "nebil esmael suleyman",
]


def run(cmd: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, text=True, check=check, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def git(*args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    return run(["git", *args], check=check)


def ensure_clean_worktree() -> None:
    status = git("status", "--porcelain=v1").stdout.strip()
    if status:
        raise SystemExit("Working tree not clean. Commit/stash changes before rewriting history.")


def ensure_branches_exist(branches: list[str]) -> None:
    missing: list[str] = []
    for branch in branches:
        r = git("show-ref", "--verify", f"refs/heads/{branch}", check=False)
        if r.returncode != 0:
            missing.append(branch)
    if missing:
        raise SystemExit(f"Missing local branches: {', '.join(missing)}. Create/fetch them first.")


def ensure_filter_repo_installed() -> None:
    r = run(["git", "filter-repo", "--help"], check=False)
    if r.returncode != 0:
        raise SystemExit(
            "git-filter-repo is not installed.\n"
            "Install it, then re-run:\n"
            "  - macOS: brew install git-filter-repo\n"
            "  - Linux (Debian/Ubuntu): sudo apt install git-filter-repo\n"
            "  - or: pipx install git-filter-repo\n"
        )


def build_commit_callback(from_emails: list[str], from_names: list[str], rewrite_committer: bool) -> str:
    # This code is executed by git-filter-repo. It has access to `commit`.
    from_emails_lit = repr({e.strip().lower() for e in from_emails if e.strip()})
    from_names_lit = repr({n.strip().lower() for n in from_names if n.strip()})

    return f"""
FROM_EMAILS = {from_emails_lit}
FROM_NAMES = {from_names_lit}

def _lower_bytes(b):
    try:
        return b.decode('utf-8', errors='ignore').lower()
    except Exception:
        return ''

def _touches(commit):
    paths = []
    for fc in getattr(commit, 'file_changes', []) or []:
        try:
            p = fc.filename.decode('utf-8', errors='ignore')
        except Exception:
            p = ''
        if p:
            paths.append(p)
    return paths

def _score(paths, msg):
    ui_prefixes = ('app/', 'components/', 'hooks/', 'public/', 'styles/', 'assets/')
    service_prefixes = ('app/services/', 'app/api/', 'lib/', 'openapi', 'prisma', 'server', 'backend')

    ui_score = 0
    svc_score = 0
    doc_score = 0

    for p in paths:
        pl = p.lower()
        if pl.endswith(('.css', '.scss', '.sass', '.less')):
            ui_score += 2
        if pl.endswith(('.tsx', '.jsx')):
            ui_score += 1
        if pl.endswith(('.ts', '.js')):
            svc_score += 1
        if pl.endswith(('.md', '.txt')):
            doc_score += 1
        if pl.startswith(ui_prefixes):
            ui_score += 2
        if pl.startswith(service_prefixes):
            svc_score += 2

    ml = (msg or '').lower()
    if any(k in ml for k in ('ui','style','css','layout','dashboard','homepage','landing','profile','library')):
        ui_score += 2
    if any(k in ml for k in ('api','service','auth','moderation','notification','reaction','endpoint','schema')):
        svc_score += 2
    if ml.startswith('docs') or 'readme' in ml:
        doc_score += 2
    return ui_score, svc_score, doc_score

def _pick_identity(ui_score, svc_score, doc_score):
    if ui_score > svc_score and ui_score > 0:
        return b{SIHAM.name!r}, b{SIHAM.email!r}
    if svc_score > 0:
        return b{EZEDIN.name!r}, b{EZEDIN.email!r}
    return b{NEZIF.name!r}, b{NEZIF.email!r}

def _is_from_me(name_b, email_b):
    name = _lower_bytes(name_b).strip()
    email = _lower_bytes(email_b).strip()
    if email and email in FROM_EMAILS:
        return True
    if name and name in FROM_NAMES:
        return True
    return False

if _is_from_me(commit.author_name, commit.author_email):
    paths = _touches(commit)
    try:
        msg = commit.message.decode('utf-8', errors='ignore')
    except Exception:
        msg = ''
    ui_score, svc_score, doc_score = _score(paths, msg)
    new_name, new_email = _pick_identity(ui_score, svc_score, doc_score)
    commit.author_name = new_name
    commit.author_email = new_email

if {str(bool(rewrite_committer))} and _is_from_me(commit.committer_name, commit.committer_email):
    paths = _touches(commit)
    try:
        msg = commit.message.decode('utf-8', errors='ignore')
    except Exception:
        msg = ''
    ui_score, svc_score, doc_score = _score(paths, msg)
    new_name, new_email = _pick_identity(ui_score, svc_score, doc_score)
    commit.committer_name = new_name
    commit.committer_email = new_email
""".strip()


def preview_assignment(from_emails: list[str], from_names: list[str]) -> None:
    ensure_branches_exist(["main", "dev"])
    revs = git("rev-list", "--reverse", "main", "dev").stdout.splitlines()

    from_emails_set = {e.lower() for e in from_emails}
    from_names_set = {n.lower() for n in from_names}

    def is_me(name: str, email: str) -> bool:
        return (email or "").strip().lower() in from_emails_set or (name or "").strip().lower() in from_names_set

    counts = {"siham": 0, "ezedin": 0, "nezif": 0, "kept": 0}

    for sha in revs:
        meta = git("show", "-s", "--format=%an%n%ae%n%s", sha).stdout.splitlines()
        if len(meta) < 3:
            continue
        author_name, author_email, subject = meta[0], meta[1], meta[2]
        if not is_me(author_name, author_email):
            counts["kept"] += 1
            continue

        files = git("show", "--name-only", "--pretty=format:", sha).stdout.splitlines()
        paths = [f for f in files if f.strip()]

        ui_score = 0
        svc_score = 0
        for p in paths:
            pl = p.lower()
            if pl.startswith(("app/", "components/", "hooks/", "public/", "styles/", "assets/")):
                ui_score += 2
            if pl.startswith(("app/services/", "app/api/", "lib/")) or "openapi" in pl:
                svc_score += 2
            if pl.endswith((".css", ".scss", ".sass", ".less", ".tsx", ".jsx")):
                ui_score += 1
            if pl.endswith((".ts", ".js")):
                svc_score += 1

        sl = subject.lower()
        if any(k in sl for k in ("ui", "style", "css", "layout", "dashboard", "homepage", "landing", "profile", "library")):
            ui_score += 2
        if any(k in sl for k in ("api", "service", "auth", "moderation", "notification", "reaction", "endpoint", "schema")):
            svc_score += 2

        if ui_score > svc_score and ui_score > 0:
            counts["siham"] += 1
        elif svc_score > 0:
            counts["ezedin"] += 1
        else:
            counts["nezif"] += 1

    print("Preview (no rewrite performed):")
    print(f"  would-rewrite -> {SIHAM.name}: {counts['siham']}")
    print(f"  would-rewrite -> {EZEDIN.name}: {counts['ezedin']}")
    print(f"  would-rewrite -> {NEZIF.name}: {counts['nezif']}")
    print(f"  unchanged commits (not yours): {counts['kept']}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Rewrite commits authored/committed by you to other identities on main+dev (history rewrite)."
    )
    parser.add_argument("--from-email", action="append", default=[], help="Email to treat as 'yours' (repeatable).")
    parser.add_argument("--from-name", action="append", default=[], help="Name to treat as 'yours' (repeatable).")
    parser.add_argument("--no-rewrite-committer", action="store_true", help="Only rewrite author; leave committer as-is.")
    parser.add_argument("--preview", action="store_true", help="Preview how commits would be assigned without rewriting.")
    parser.add_argument("--apply", action="store_true", help="Actually run git filter-repo (rewrites history).")
    args = parser.parse_args()

    if not args.preview and not args.apply:
        parser.error("Choose one: --preview or --apply")

    from_emails = (args.from_email or []) + DEFAULT_FROM_EMAILS
    from_names = (args.from_name or []) + DEFAULT_FROM_NAMES
    rewrite_committer = not args.no_rewrite_committer

    ensure_branches_exist(["main", "dev"])

    if args.preview:
        preview_assignment(from_emails=from_emails, from_names=from_names)
        return 0

    ensure_clean_worktree()
    ensure_filter_repo_installed()
    callback = build_commit_callback(from_emails=from_emails, from_names=from_names, rewrite_committer=rewrite_committer)

    print("About to rewrite history on refs: main, dev")
    print("This will change commit SHAs. Make sure your team is ready for a force-push.")
    print("")

    cmd = [
        "git",
        "filter-repo",
        "--force",
        "--refs",
        "main",
        "dev",
        "--commit-callback",
        callback,
    ]
    print("Running:")
    print("  " + " ".join(shlex.quote(c) for c in cmd))
    p = run(cmd, check=False)
    sys.stdout.write(p.stdout)
    sys.stderr.write(p.stderr)
    if p.returncode != 0:
        return p.returncode

    print("")
    print("Done. New shortlog (main):")
    sys.stdout.write(git("shortlog", "-sne", "main").stdout)
    print("New shortlog (dev):")
    sys.stdout.write(git("shortlog", "-sne", "dev").stdout)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

