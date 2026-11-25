# once-ui-react

React component library for Oncehub

## Usage

```sh
npm install @oncehub/ui-react
# or
pnpm add @oncehub/ui-react
```

## Development

Prerequisites:

- Node.js version from [`.nvmrc`](.nvmrc) (e.g. `nvm use`).
- [pnpm](https://pnpm.io/installation). The exact version is pinned in the `packageManager` field of `package.json` and pnpm switches to it automatically. Corepack is not used (it is no longer shipped with Node.js 25+). npm and Yarn are blocked in this repository.

```sh
pnpm install
pnpm dev
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for dependency and security rules, releasing, and rollback steps.

1. Storybook is [automatically deployed](.github/workflows/deploy-storybook.yml) to Github Pages when pushing to main.
2. Package is automatically pushed to npm when [creating a new release](.github/workflows/npm-publish.yml) on Github. Check out the release section in the repo. Read more about releases [here](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository).

## Tools

- ⚛️ [React 18](https://reactjs.org/)
- 📚 [Storybook 7](https://storybook.js.org/) - Components preview
- 🖌️ [Tailwind CSS 4](https://tailwindcss.com/)
- ⏩ [Vite](https://vitejs.dev/) - Run and build the project blazingly fast!
- ⚡ [Vitest](https://vitest.dev/) - Components Unit Testing
- 📐 [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) - Formatting and Linting
- 🌟 [Typescript](https://www.typescriptlang.org/)
- 🐶 [Husky](https://typicode.github.io/husky) & [Lint Staged](https://www.npmjs.com/package/lint-staged) - Pre-commit Hooks
- ⏰ [Release Please](https://github.com/googleapis/release-please) — Generate the changelog with the release-please workflow
- 👷 [Github Actions](https://github.com/features/actions) — Releasing versions to npm

## Main Scripts

Run with `pnpm <script>` (e.g. `pnpm build:lib`).

- `dev`: Bootstrap the Storybook preview with Hot Reload.
- `build`: Builds the static storybook project.
- `build:lib`: Builds the component library into the **dist** folder.
- Tailwind CSS v4 utilities use the `tw:` prefix (for example, `tw:flex`).
- `lint:fix`: Applies linting based on the rules defined in **.eslintrc.js**.
- `format:prettier`: Formats files using the prettier rules defined in **.prettierrc**.
- `test`: Runs testing using watch mode.
- `test:cov`: Runs testing displaying a coverage report.

## Acknowledgments

The project has been scaffolded using [vite-component-library-template](https://github.com/IgnacioNMiranda/vite-component-library-template)

## License

[MIT](LICENSE)
