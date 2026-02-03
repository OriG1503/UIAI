# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Angular 19 client app using mock data instead of a real server.

## Tech Stack
- Angular 19
- Node.js 20.10.0
- npm 10.9.2
- PrimeNG (UI library)
- SCSS for styling

## Commands
```bash
npm start        # Start dev server (http://localhost:4200)
npm run build    # Production build
npm test         # Run unit tests with Karma
```

## Folder Structure
```
src/app/
├── core/           # Singleton services, guards, interceptors, store logic, app-wide utilities
├── features/       # Feature modules (lazy-loaded), each feature owns its own atomic design layers
│   └── <feature>/  # e.g., search/, inbox-mail-list/, mail-content/
│       ├── atoms/          # Feature-specific basic UI elements
│       ├── molecules/      # Feature-specific combinations of atoms
│       ├── organisms/      # Business logic components
│       ├── types/          # Feature-specific types (each type in its own file)
│       ├── constants/      # Feature-specific constants
│       └── translations/   # Feature-specific translation maps
├── shared/         # Only truly cross-feature items (used by 2+ features)
│   ├── atoms/      # Global basic UI elements (e.g., Icon)
│   ├── types/      # Cross-feature types (Mail, MailUserInfo, HighlightMatch)
│   ├── translations/ # Cross-feature translations (common, inbox)
│   └── pipes/      # Cross-feature pipes (HighlightTextPipe)
```

## Atomic Design (Component Architecture)
- **Atoms** - Basic UI elements (buttons, inputs, icons) - no logic, purely presentational
- **Molecules** - Combinations of atoms - minimal logic if needed
- **Organisms** - Live in `features/` only - contain most of the business logic

## SOLID Principles & Generic Code
- **Single Responsibility**: Each component/service should have one clear purpose
- **Open/Closed**: Use inputs/outputs for extensibility, avoid modifying existing code
- **Dependency Inversion**: Depend on abstractions (types, interfaces) not concrete implementations
- **DRY**: Extract reusable logic into shared components, types, and constants
- **No magic numbers**: All numeric constants must be defined in the feature's `constants/` folder (or `shared/constants/` if cross-feature)
- **No hardcoded strings**: Use translation types/maps for all user-facing text (especially Hebrew)
- **Reuse atoms**: Always use the Icon atom (`<app-icon>`) instead of raw `<i>` tags

## Conventions
- Use standalone components (Angular 19 default)
- **Signals for inputs/outputs**: Use `input()` and `output()` signals for component communication
- **model() only for ControlValueAccessor**: Only use `model()` when implementing form controls with ControlValueAccessor
- Observable subscriptions should be in components
- Mock data instead of real API calls
- SCSS for component styling
- **Direct imports**: Always import from the specific file path, not from folder barrels (no index.ts files)
- No spec/test files (.spec.ts) in the project
- Prettier for code formatting (see config file)
- Each type should have its own file in the owning feature's `types/` folder (or `shared/types/` only if used by 2+ features)
- Prefer `type` over `interface`
- **Every component must have 3 separate files**: `.ts`, `.html`, `.scss` (even if empty)
- **No inline templates/styles**: Always use `templateUrl` and `styleUrl` pointing to external files

## SCSS Rules
- **Mirror HTML hierarchy**: SCSS nesting must match the HTML structure exactly
- **No global styles**: Avoid adding styles to `styles.scss` - use component styles instead
- **No !important**: Use `ViewEncapsulation.None` at component level for PrimeNG overrides
- **Component encapsulation**: Each component handles its own PrimeNG overrides

## Naming Conventions
- Private members: prefix with `_` (e.g., `_privateVar`)
- Signals: prefix with `$` (e.g., `$count`)
- Booleans: prefix with `is` (e.g., `isActive`, `isAvailable`)
- **File names**: lowercase with single hyphen separator (e.g., `search-bar.component.ts`)
- **CSS classes**: lowercase with single hyphen separator, no IDs (e.g., `.search-bar`, `.field-text`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_VERBAL_DATE_AMOUNT`)
- **Translation keys**: camelCase matching the context (e.g., `dateRangeLabels`, `buttonLabels`)

## Code Style
- **No** `let`, `for`, `while` - use `forEach`, `map`, `filter`, etc.
- **Always use braces `{}` for `if` statements** - never use shorthand single-line `if` without braces (e.g., `if (x) return;`). Always wrap the body in `{}`
- Clickable elements must use `<button>` tag (not labels, divs, spans)
- Navigation links must use `<a>` tag

## CSS/SCSS Units
- `vh` - only for top-level/root elements
- `%` - for all nested elements
- `rem` - for font sizes, margin, and padding

## Color Palette
| Color | Hex | CSS Variable |
|-------|-----|--------------|
| Red | `#e74b3b` | `--color-red` |
| Light Gray | `#efefef` | `--color-light-gray` |
| Navy Blue/Gray | `#bfc4cd` | `--color-navy-gray` |
| White Soft | `#f9fafc` | `--color-white-soft` |
| Dark Navy Blue | `#03153a` | `--color-dark-navy` |
| White | `#ffffff` | `--color-white` |
| Blue | `#3f70e3` | `--color-blue` |
| Orange | `#ffb656` | `--color-orange` |
| Yellow | `#ffee80` | `--color-yellow` |

### Attachment Colors
| Extension | Hex |
|-----------|-----|
| .docx | `#2f67bf` |
| .xlsx | `#219a58` |
| .png | `#01caff` |
| .pdf | `#ea355a` |

## Core Services (in `core/services/`)
- `MockMailService` - Mail data operations (CRUD, starring, read/unread status)
- `MockMailContentService` - Email body content retrieval
- `SelectedMailService` - Shared state for currently selected mail and navigation

## Store Structure (in `core/`)
State slices: `call`, `tag`, `query`, `router`, `search`

With effects (server calls): `last-search`, `mailbox-mail`, `mails`, `saved-search`

## Angular Signals Pattern
- Use `signal()` for local component state
- Use `computed()` for derived state
- Use `effect()` for reactive side effects (e.g., syncing services)
- Input signals: `$input = input<Type>(defaultValue, { alias: 'inputName' })`
- Output signals: `outputName = output<Type>()`

## Core Types

```typescript
type Mail = {
  tag: string;
  subject: string;
  filename: string;
  attachments: { filename: string[] };
  from: MailUserInfo;
  to: MailUserInfo[];
  cc?: MailUserInfo[];
  bcc?: MailUserInfo[];
  sent: Date;
  mailbox_name: string;
  body_paths?: string[];
  html_path?: string[];
  seen?: boolean;
};

type MailUserInfo = {
  mail?: string;
  tag?: string;
  username?: string;
};
```
