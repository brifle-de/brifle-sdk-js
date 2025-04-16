import typescript from 'rollup-plugin-typescript2';
import dts from "rollup-plugin-dts";

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/esm/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [typescript()],
  },
  {
    input: "dist/types/index.d.ts",
    output: { file: "dist/index.d.ts", format: "es" },
    plugins: [dts()],
  }
];