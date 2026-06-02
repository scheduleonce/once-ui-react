# Copilot Instructions for once-ui-react

## Project Overview

React component library for OnceHub with TypeScript, SCSS modules, Storybook, and accessibility-first design.

## Component Architecture Patterns

### Core Component Structure

Every component follows this pattern:

- **Interface**: Extends `ComponentPropsWithRef<'element'>` for proper ref forwarding
- **forwardRef**: All components use `React.forwardRef` with explicit generic typing
- **SCSS Modules**: Import as `styles from './component.module.scss'`
- **Theme Color**: Optional `themeColor?: string` prop with luminance-based styling

Example from `button.tsx`:

```tsx
interface ButtonProps extends ComponentPropsWithRef<'button'> {
  themeColor?: string;
  variant?: 'primary' | 'secondary';
}

export const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ComponentPropsWithRef<'button'> & ButtonProps>(
  ({ themeColor = '', className = '', style = {}, ...rest }, ref) => {
    // Theme color processing with ColorsService and luminance
  },
);
```

### Theme Color Implementation

Theme colors use consistent pattern across components:

1. **Import**: `import luminance from '@oncehub/relative-luminance'` and `import { ColorsService } from '../colors.service'`
2. **Processing**: `themeColor = ColorsService.convert3HexTo6(themeColor)` converts 3-char hex to 6-char
3. **Luminance**: `const theme = luminance(themeColor)` returns 'dark' | 'light' for contrast decisions
4. **Conditional Styling**: Apply different colors based on theme and component state

### SCSS Module Conventions

- Use Tailwind classes with `tw-` prefix: `@apply tw-flex tw-items-center`
- Combine with CSS modules for component-specific styles
- Responsive and state-based classes: `hover:tw-underline focus:tw-outline-2`

### Focus State Management

Components handling focus use this pattern:

```tsx
const [isFocused, setIsFocused] = useState(false);

const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
  setIsFocused(true);
  onFocus?.(e); // Call parent handler if provided
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
  setIsFocused(false);
  onBlur?.(e); // Call parent handler if provided
};

// In component destructuring, extract onFocus/onBlur explicitly:
({ themeColor, onFocus, onBlur, ...rest }) => {
```

### Dropdown/Portal Components

Complex components like `MultiSelect` and `AutoComplete` use:

- **createPortal**: `createPortal(jsx, document.body)` for overlay positioning
- **Position calculation**: Dynamic positioning with viewport and scroll awareness
- **Click outside**: Event listeners for closing dropdowns
- **Keyboard navigation**: Arrow keys, Enter, Escape handling with ARIA announcements

## Key Development Commands

- **Development**: `npm run dev` - Starts Storybook on port 6006
- **Build Library**: `npm run build:lib` - Builds to `dist/` folder
- **Linting**: `npm run lint` - ESLint 9 with flat config
- **Auto-fix**: `npm run fix:lint` - Auto-fixes linting issues
- **Testing**: `npm test` - Vitest with coverage via `npm run test:cov`
- **Publishing**: `npm publish --access public --tag beta` (for prerelease versions)

## Project Structure Conventions

```
src/lib/
├── components/           # Component folders
│   └── component-name/
│       ├── index.tsx     # Re-exports
│       ├── component-name.tsx
│       ├── component-name.module.scss
│       ├── component-name.stories.tsx
│       └── README.md
├── interfaces/           # Shared TypeScript interfaces
│   └── select.type.ts    # IOption interface for selects
└── tailwind/
    └── theme.css         # Global Tailwind imports
```

## Accessibility Requirements

- All interactive components include proper ARIA attributes
- Focus management with visible focus indicators
- Screen reader support with `aria-live` announcements
- Keyboard navigation (Arrow keys, Enter, Escape, Tab)
- Role attributes: `role="combobox"`, `aria-expanded`, `aria-haspopup`

## External Dependencies Integration

- **Headless UI**: Use `@headlessui/react` for complex components like AutoComplete
- **Heroicons**: Import icons from `@heroicons/react/20/solid`
- **Phone Components**: Use `libphonenumber-js` and `react-phone-number-input` as peer dependencies

## ESLint & Code Quality

Project uses ESLint 9 flat config. Key rules:

- `@typescript-eslint/no-unused-vars: 'warn'` - Remove unused variables
- `jsx-a11y/role-supports-aria-props: 'warn'` - Accessibility compliance
- React 19 compatibility with auto-imported React

## Build & Publishing Notes

- **ES Modules**: `"type": "module"` in package.json
- **Vite Build**: Builds both ES and UMD formats
- **Types**: Generated via `vite-plugin-dts`
- **Prerelease**: Use `--tag beta` for beta versions
- **Package Auto-clean**: `prepack` script removes dev dependencies before publish
