#!/usr/bin/env node
// Vendors the public Brifle API spec into openapi/api.json, the single input of
// `npm run generate`.
//
//   BRIFLE_CORE_DIR=../brifle-core node scripts/pull-spec.mjs   # runs `mix openapi.export`
//   SPEC_FILE=/path/to/api.json   node scripts/pull-spec.mjs     # copies an exported spec
//
// brifle-core names operations after their controller action
// ("Web.Api.Controller.ContentController.send"); they are shortened to
// "contentSend" so the generated functions get readable names. Nothing else in
// the spec is changed.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const out = resolve(import.meta.dirname, '..', 'openapi', 'api.json')

let file = process.env.SPEC_FILE
if (!file) {
  const core = process.env.BRIFLE_CORE_DIR
  if (!core) {
    console.error('Set BRIFLE_CORE_DIR (brifle-core checkout) or SPEC_FILE (an exported api.json).')
    process.exit(1)
  }
  const dir = mkdtempSync(join(tmpdir(), 'brifle-openapi-'))
  execFileSync('mix', ['openapi.export', '--out', dir], {
    cwd: core,
    stdio: ['ignore', 'inherit', 'inherit'],
    env: { ...process.env, MIX_ENV: process.env.MIX_ENV ?? 'test' },
  })
  file = join(dir, 'api.json')
}

const spec = JSON.parse(readFileSync(file, 'utf8'))
const seen = new Map()
for (const [path, ops] of Object.entries(spec.paths ?? {})) {
  for (const [method, op] of Object.entries(ops)) {
    if (typeof op !== 'object' || !op.operationId) continue
    const m = /(?:^|\.)(\w+?)Controller\.(\w+)$/.exec(op.operationId)
    if (!m) continue
    const camel = (s) => s.replace(/_(\w)/g, (_, c) => c.toUpperCase())
    const id = camel(m[1].charAt(0).toLowerCase() + m[1].slice(1)) + camel('_' + m[2])
    if (seen.has(id)) throw new Error(`operationId ${id} used by ${seen.get(id)} and ${method.toUpperCase()} ${path}`)
    seen.set(id, `${method.toUpperCase()} ${path}`)
    op.operationId = id
  }
}
writeFileSync(out, JSON.stringify(spec, null, 2) + '\n')
console.log(`${out}: ${seen.size} operations, API version ${spec.info?.version}`)
