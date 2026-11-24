/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { module: "commonjs", esModuleInterop: true, isolatedModules: true } }],
  },
  testMatch: ["<rootDir>/test/**/*.test.ts"],
};
