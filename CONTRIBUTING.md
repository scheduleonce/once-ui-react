# Contributing to @oncehub/ui-react

## Toolchain

| Tool                        | Version                    | Where it is pinned                                          |
| --------------------------- | -------------------------- | ----------------------------------------------------------- |
| Node.js                     | 26.13.1 (LTS)              | [`.nvmrc`](.nvmrc), read by CI via `node-version-file`      |
| pnpm                        | 12.17.0 (OnceHub-approved) | `packageManager` and `devEngines.packageManager`            |
| Node.js range for consumers | `>=22`                     | `engines.node` (published; separate from the dev toolchain) |

pnpm is the only supported package manager. npm and Yarn are blocked: `devEngines.packageManager` makes the npm CLI stop with `EBADDEVENGINES`, and `preinstall: npx only-allow pnpm` rejects other package managers. Corepack is not used (it is not shipped with Node.js 25+).

## Setup

```sh
nvm install && nvm use       # Node.js from .nvmrc
npm install -g pnpm          # once; any pnpm version switches itself to the pinned one
pnpm install                 # also installs the git hooks (husky)
```

After pulling changes that touch the git hooks, run `pnpm install` again so that `core.hooksPath` points to `.husky/_`.

## Common commands

| Command                       | What it does                                    |
| ----------------------------- | ----------------------------------------------- |
| `pnpm dev`                    | Storybook on http://localhost:6006              |
| `pnpm build:lib`              | Type-check and build the library into `dist/`   |
| `pnpm build`                  | Static Storybook build into `storybook-static/` |
| `pnpm lint`                   | ESLint                                          |
| `pnpm test:prettier`          | Prettier check                                  |
| `pnpm test` / `pnpm test:cov` | Vitest (watch / with coverage)                  |

The pre-commit hook runs `pnpm run lint` (errors block the commit) and lint-staged (`prettier -w` on staged files).

## Dependency rules

- Commit only `pnpm-lock.yaml`. `package-lock.json` and `yarn.lock` are git-ignored. CI installs with `pnpm install --frozen-lockfile`.
- Keep pnpm's default isolated `node_modules` layout. Do not enable `shamefullyHoist` or `nodeLinker: hoisted`; declare every package you import instead (peer dependencies used in source, stories or tests must also be devDependencies).
- Supply-chain policies live in [`pnpm-workspace.yaml`](pnpm-workspace.yaml) and are reviewed by `@scheduleonce/security` (see `CODEOWNERS`):
  - `minimumReleaseAge: 1440` — versions published less than 24 hours ago are not installed. Add a narrow `minimumReleaseAgeExclude` entry only when an immediate internal release requires it.
  - `allowBuilds` + `strictDepBuilds: true` — a new dependency with an install script fails the install until it is reviewed and listed in `allowBuilds`. Never use `dangerouslyAllowAllBuilds`.
  - `blockExoticSubdeps: true` — only direct dependencies may come from git or tarball URLs.
  - `trustPolicy: no-downgrade` — versions whose trust evidence is weaker than earlier releases are refused. Exceptions go in `trustPolicyExclude` as exact `name@version` entries with a dated reason.
  - `verifyStoreIntegrity: true`.
- No registry credentials in the repository. Publishing uses npm trusted publishing (OIDC) from GitHub Actions; there is no npm token.

## Releasing

Releases are published by [`.github/workflows/npm-publish.yml`](.github/workflows/npm-publish.yml) when a GitHub release is created: `pnpm install --frozen-lockfile`, `pnpm run build:lib`, then `pnpm publish --access public --tag beta --no-git-checks` with npm trusted publishing. Do not publish from a local machine.

`prepack` removes `devDependencies`, `packageManager`, `devEngines` and the `preinstall` script from the published `package.json`, so consumers are not affected by this repository's toolchain rules. To inspect what would be published, run `pnpm pack` in a throwaway clone (prepack edits `package.json` in place).

## npm → pnpm migration notes (November 2026)

Install time and disk usage, measured on one developer machine (Node.js 26.13.1, separate empty cache/store for the cold runs):

| Scenario                                                     | npm 11.20 (`npm ci`, 785 packages)   | pnpm 12.17 (same dependencies)              | pnpm 12.17 (after removing unused dependencies, 702 packages) |
| ------------------------------------------------------------ | ------------------------------------ | ------------------------------------------- | ------------------------------------------------------------- |
| Cold install (empty cache/store)                             | 35.9 s                               | 8.8 s                                       | 7.9 s                                                         |
| Warm install (cache/store populated, `node_modules` deleted) | ~4.9 s                               | ~0.3 s                                      | ~0.3 s                                                        |
| Disk                                                         | 454 MB `node_modules` + 127 MB cache | 434 MB `node_modules` + store (hard-linked) | 394 MB                                                        |

The pnpm store is shared by all projects on the machine, so the saving grows with each additional pnpm project.

### Rollback

Every step of the migration is a separate commit, so it can be reverted with `git revert <commit>`, newest first:

- **Release job only** (e.g. if `pnpm publish` with trusted publishing fails): revert `build: pin pnpm 12.17.0 in devEngines.packageManager` and `ci: publish with pnpm instead of the npm CLI` together. The release job then uses `npm publish` again.
- **Whole migration back to npm**: revert the pnpm commits (from `build: migrate package manager from npm to pnpm 12.17.0` onwards, newest first), which restores `package-lock.json`, the npm-based workflows and hooks. Then each developer runs `npm ci`; after reverting the husky upgrade, run `git config --unset core.hooksPath` (or `npm ci`, whose `prepare` script reinstalls husky 8).
- **A published version**: the published JavaScript, CSS and type declarations were byte-identical before and after the migration. If a release made from this toolchain misbehaves, publish a new patch version from the reverted state; do not unpublish.
