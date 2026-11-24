#!/usr/bin/env bash
# Sets "version" in package.json and the two root entries of package-lock.json
# (the lockfile itself and packages[""]), so `npm ci` sees a consistent pair.
# Prints "changed" or "unchanged".
#
#   set-version.sh 0.7.3-rc.4
#   VERSION_ROOT=/tmp/worktree set-version.sh 0.7.3
set -euo pipefail

version="${1:-}"
root="${VERSION_ROOT:-$(git rev-parse --show-toplevel)}"

semver='^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$'
[[ "$version" =~ $semver ]] || { echo "usage: $0 X.Y.Z[-pre] (got '$version')" >&2; exit 1; }
[[ -f "$root/package.json" && -f "$root/package-lock.json" ]] || { echo "package.json / package-lock.json not found in $root" >&2; exit 1; }

# Both files are npm's own output: two-space indent and a trailing newline,
# which JSON.stringify(…, null, 2) + "\n" reproduces byte for byte.
node - "$root" "$version" <<'JS'
const fs = require('fs');
const [root, version] = process.argv.slice(2);
const read = (f) => JSON.parse(fs.readFileSync(`${root}/${f}`, 'utf8'));
const write = (f, obj) => fs.writeFileSync(`${root}/${f}`, JSON.stringify(obj, null, 2) + '\n');
const pkg = read('package.json');
const lock = read('package-lock.json');
if (pkg.version === version && lock.version === version && lock.packages[''].version === version) {
  console.log('unchanged');
  process.exit(0);
}
pkg.version = version;
lock.version = version;
lock.packages[''].version = version;
write('package.json', pkg);
write('package-lock.json', lock);
console.log('changed');
JS
