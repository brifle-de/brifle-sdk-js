import { defineConfig } from '@hey-api/openapi-ts'

// Low-level client, generated from openapi/api.json (see scripts/pull-spec.mjs).
// src/generated is internal: the public API is the hand-written layer in
// src/endpoints, which maps onto these functions and types.
export default defineConfig({
  input: './openapi/api.json',
  output: {
    path: 'src/generated',
    postProcess: [],
  },
  plugins: [
    '@hey-api/client-axios',
    '@hey-api/typescript',
    { name: '@hey-api/sdk', auth: true },
  ],
})
