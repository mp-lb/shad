## Scripts

Write project scripts in TypeScript in the package that owns the behaviour, or `packages/scripts` when there is no natural owner, and include them in normal lint and typecheck checks. Expose scripts through thin Zap tasks using `tsx`; component tests belong in `tests/*.test.ts` and run with `zap t test`, using `tsx` and `tsconfig.tests.json` for the docs aliases.
