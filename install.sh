#!/bin/sh
# Install the skills into ~/.claude/skills (or $CLAUDE_SKILLS_DIR).
# Never overwrites an existing skill unless you pass --force.
set -eu
DEST="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1
HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$DEST"
n=0; skipped=0
for dir in "$HERE"/skills/*/; do
  name="$(basename "$dir")"
  if [ -e "$DEST/$name" ] && [ "$FORCE" -ne 1 ]; then
    echo "skip   $name (exists; use --force to replace)"
    skipped=$((skipped + 1)); continue
  fi
  rm -rf "$DEST/$name"
  cp -R "$dir" "$DEST/$name"
  echo "install $name"
  n=$((n + 1))
done
echo "done: $n installed, $skipped skipped, into $DEST"
