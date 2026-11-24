#!/usr/bin/env bash
# Commits <version> into this repo's version file(s) (see set-version.sh) on top
# of <base-sha> and prints the commit to tag. When set-version.sh changes
# nothing, no commit is made and <base-sha> itself is printed. Nothing is
# pushed, and the current checkout is not touched: the commit is made in a
# temporary worktree, so the scripts that are running stay in place even when
# <base-sha> predates them.
#
# The message prefix is what build-and-push.yml's check-branch skips on, so the
# push of this commit to release/X.Y does not start another release run.
#
#   SHA=$(commit-version.sh 2.10.3-rc.4 "$GITHUB_SHA")
set -euo pipefail

version="${1:-}"
base="${2:-}"
[[ -n "$version" && -n "$base" ]] || { echo "usage: $0 <version> <base-sha>" >&2; exit 1; }

here="$(cd "$(dirname "$0")" && pwd)"
base="$(git rev-parse --verify "$base^{commit}")"
tree="$(mktemp -d)"
trap 'git worktree remove --force "$tree" >/dev/null 2>&1 || true; rm -rf "$tree"' EXIT
git worktree add -q --detach "$tree" "$base" >&2

if [[ "$(VERSION_ROOT="$tree" "$here/set-version.sh" "$version")" == unchanged ]]; then
  echo "$base"
  exit 0
fi

# The worktree is fresh, so everything modified is the version change.
git -C "$tree" add -u
git -C "$tree" \
    -c user.name="brifle-release-bot[bot]" \
    -c user.email="brifle-release-bot[bot]@users.noreply.github.com" \
    commit -q -m "chore(release): version $version"
git -C "$tree" rev-parse HEAD
