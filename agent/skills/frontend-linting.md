# Frontend Linting & Formatting Quality Gate

## Context
Use these guidelines to setup industry-standard code quality tools for Frontend projects (React + TypeScript).

## 1. ESLint (v9+ Flat Config)
- **File**: `eslint.config.mjs`
- **Goal**: Catch logic errors, enforce hook rules, type safety.
- **Important Rules**:
  - `react-hooks/exhaustive-deps`: "warn" (crucial for catching stale closures).
  - `react-hooks/rules-of-hooks`: "error" (prevents calling hooks conditionally).
  - `@typescript-eslint/no-explicit-any`: "warn" or "error" (enforce strict typing).
- **Integration**: Always include `eslint-config-prettier` at the END of the config array to prevent conflicts between ESLint formatting rules and Prettier.

## 2. Prettier
- **File**: `.prettierrc`
- **Goal**: Uniform code style across the team.
- **Config**: 
  - `semi: true`, `singleQuote: true`, `tabWidth: 2`, `printWidth: 100`, `trailingComma: "es5"`.
- **Integration**: Configure `.prettierignore` to skip build artifacts (`dist`, `node_modules`, `coverage`).

## 3. Git Hooks (Husky & lint-staged)
- **Goal**: Prevent bad code from being committed.
- **Setup**:
  - `npx husky init`
  - Add `lint-staged` to `package.json` to run ESLint and Prettier ONLY on staged files.
  - Update `.husky/pre-commit` to run `npx lint-staged`.

## 4. CI/CD Integration
- In GitHub actions, ALWAYS use `npm install` instead of `npm ci` if `package-lock.json` might be out of sync in fast-paced iterations.
- Run format checks (`npx prettier --check .`) and lint checks (`npm run lint`).
- Separate `tsc --noEmit` as a `type-check` script.
