#!/usr/bin/env bash
# Prints the release-candidate tag the next merge into release/<minor> gets:
# v<minor>.<last stable patch + 1>-rc.<highest existing rc + 1>.
# "Published" means a stable git tag v<minor>.<patch>; those are only created by
# the promote workflow. With none yet the next patch is 0.
#
# An optional MIN_PATCH raises the patch (the workflow passes it for patches that
# are released in the registry but have no stable git tag).
#
#   next-rc-tag.sh 2.10      # -> v2.10.2-rc.1
#   next-rc-tag.sh 2.10 3    # -> v2.10.3-rc.1 (at least patch 3)
set -euo pipefail

minor="${1:-}"
min_patch="${2:-0}"
[[ "$minor" =~ ^[0-9]+\.[0-9]+$ && "$min_patch" =~ ^[0-9]+$ ]] || { echo "usage: $0 X.Y [MIN_PATCH]" >&2; exit 1; }

# Fixed-string prefix match, then an anchored regex: '.' in the minor must not act as a wildcard.
last_patch="$(git tag -l "v$minor.*" | grep -E "^v${minor//./\\.}\.[0-9]+$" | sed 's/.*\.//' | sort -n | tail -1 || true)"
next_patch=$(( ${last_patch:--1} + 1 ))
(( next_patch >= min_patch )) || next_patch=$min_patch

last_rc="$(git tag -l "v$minor.$next_patch-rc.*" | grep -E "^v${minor//./\\.}\.$next_patch-rc\.[0-9]+$" | sed 's/.*\.//' | sort -n | tail -1 || true)"
echo "v$minor.$next_patch-rc.$(( ${last_rc:-0} + 1 ))"
