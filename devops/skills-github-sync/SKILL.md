---
name: skills-github-sync
description: Backup and sync Hermes Agent skills to GitHub — init, push, and maintain a remote skills repo.
triggers:
  - "push skills to github"
  - "backup skills"
  - "sync skills ke github"
  - "save skills to repo"
  - "upload skills"
---

# Skills GitHub Sync

Push the entire `~/.hermes/skills/` directory to a GitHub repo for backup, sharing, or version control.

## Prerequisites

- GitHub PAT with `repo` scope (stored in `~/.git-credentials` or passed at runtime)
- User's GitHub username known (check memory)

## Steps

### 1. Verify Token & Username

```bash
export GITHUB_TOKEN="<token>"
curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['login'])"
```

### 2. Create Repo (if not exists)

```bash
curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{"name":"hermes-skills","description":"Hermes Agent skills collection","auto_init":true,"private":false}'
```

Use `private:true` if the skills contain sensitive red-teaming tools.

### 3. Init & Push

```bash
cd ~/.hermes/skills
git init
git remote add origin https://$GITHUB_TOKEN@github.com/<username>/<repo>.git
git add -A
git commit -m "Initial commit: all Hermes skills"
git branch -M main
git push -u origin main --force
```

### 4. Subsequent Syncs

```bash
cd ~/.hermes/skills
git add -A
git commit -m "Update skills: $(date +%Y-%m-%d)"
git push
```

## Pitfalls

- Token in remote URL leaks to `.git/config` — acceptable for single-user VMs, not for shared machines. Consider `git credential store` instead.
- `.hermes/skills/` may contain `.usage.json` and internal state files — fine to push, they're harmless.
- `--force` on initial push overwrites any `auto_init` README — intended behavior.
- Large binary files in skills (models, datasets) will bloat the repo — check with `du -sh ~/.hermes/skills/` first. Ours is ~150K lines / 596 files, which is fine.

## Trigger

When user says "push ke github", "backup skills", "save to repo", "upload skills" — load this skill and execute.
