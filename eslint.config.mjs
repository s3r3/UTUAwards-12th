import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Nested git worktrees/checkouts live here; they are separate working
    // copies with their own lint state and must not be linted as part of
    // this project (mirrors .git/info/exclude, which ESLint does not read).
    ".claude/worktrees/**",
  ]),
]);

export default eslintConfig;
