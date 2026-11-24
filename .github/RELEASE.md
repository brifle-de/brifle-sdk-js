# Releases

The SDK is built, tagged and published by GitHub Actions. Nobody publishes to
npm by hand (there is no publish script any more; `npm publish` from a laptop
is not part of the process).

| Step | What you do | What CI does |
|---|---|---|
| Start a minor | push a new branch `release/X.Y` (e.g. `release/0.4`) | commits `package.json` version `X.Y.0` |
| Release candidate | merge a PR into `release/X.Y` | runs the CI checks, tags `vX.Y.Z-rc.N`, packs the SDK and attaches the `.tgz` to a GitHub **prerelease** ([release-candidate.yml](workflows/release-candidate.yml)). Not on npm. |
| Release | Actions → *Promote release candidate to npm* → `vX.Y.Z-rc.N` | builds the rc's source as `X.Y.Z`, publishes it to npm (`latest` for the newest version, `release-X.Y` for fixes of an older minor), then creates the tag `vX.Y.Z` and the GitHub Release ([promote.yml](workflows/promote.yml)) |

`Z` is one more than the last stable `vX.Y.Z` tag (or than the last `X.Y.Z` on
npm, for versions published before this pipeline), so fixes for an older minor
go into its own `release/X.Y` branch.

To try a candidate in another project before promoting it:

```bash
npm install https://github.com/brifle-de/brifle-sdk-js/releases/download/vX.Y.Z-rc.N/brifle-brifle-sdk-X.Y.Z-rc.N.tgz
```

## Versioning

Within a major version the public API only grows (see README, "Compatibility"):
CI fails on any change to `etc/brifle-sdk.api.md` that is not committed. A
release that removes or changes something needs a new major (`release/1.0`).

## Updating to a new API version

```bash
BRIFLE_CORE_DIR=../brifle-core npm run spec:pull
npm run generate
npm run typecheck    # drift.test-d.ts names every public type the API change touches
```

Map changes in `src/mappers`; extend the public types only additively.

## One-time setup

Variables (Settings → Secrets and variables → Actions → Variables):

| Variable | Value |
|---|---|
| `RELEASE_APP_ID` | ID of the release GitHub App |

Secrets:

| Secret | Value |
|---|---|
| `RELEASE_APP_PRIVATE_KEY` | the App's private key |
| `NPM_TOKEN` | only if trusted publishing is not set up: an npm automation token with publish rights on `@brifle/brifle-sdk` |

Repository and npm settings:

1. Install the release GitHub App on this repository (contents: write, workflows: write).
2. Rules → new **tag** ruleset on `v*`, restrict creations, updates and
   deletions, with the release App as the only bypass actor.
3. Environments → `production` with a required reviewer: promote waits for that approval.
4. Release bot commits (`chore(release): version …`) are pushed to
   `release/X.Y`: if the branch is protected, add the App as a bypass actor.
5. npmjs.com → `@brifle/brifle-sdk` → Settings → Trusted publishing → GitHub
   Actions: repository `brifle-de/brifle-sdk-js`, workflow `promote.yml`,
   environment `production`. Then no npm token is stored in GitHub at all.
