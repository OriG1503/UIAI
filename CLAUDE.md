# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Angular 19 client app using mock data instead of a real server. Hebrew (RTL) UI with `<html lang="he" dir="rtl">`. Custom "Ploni" font.

## Tech Stack
- Angular 19
- Node.js 20.10.0
- npm 10.9.2
- PrimeNG 19 with **Aura** preset theme (dark mode disabled)
- SCSS for styling
- Sigma.js v3 + Graphology for graph visualization (ForceAtlas2 layout, `@sigma/node-border` for bordered nodes)

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
- Prettier for code formatting: `semi: true`, `arrowParens: always`, `useTabs: false`, `bracketSpacing: true`,`printWidth: 120`, `singleQuote: true`, `trailingComma: "none"`, `tabWidth: 2`, `singleAttributePerLine: true`
- Each type should have its own file in the owning feature's `types/` folder (or `shared/types/` only if used by 2+ features)
- Prefer `type` over `interface`
- **Every component must have 3 separate files**: `.ts`, `.html`, `.scss` (even if empty)
- **No inline templates/styles**: Always use `templateUrl` and `styleUrl` pointing to external files

## SCSS Rules
- **Mirror HTML hierarchy**: SCSS nesting must match the HTML structure exactly
- **No global styles**: Avoid adding styles to `styles.scss` - use component styles instead (exception: scrollbar appearance and CSS variables are defined globally)
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
| Option Hover | `rgba(63, 112, 227, 0.1)` | `--color-option-hover` |
| Option Selected | `rgba(231, 75, 59, 0.18)` | `--color-option-selected` |

### Attachment Colors
| Extension | Hex |
|-----------|-----|
| .docx | `#2f67bf` |
| .xlsx | `#219a58` |
| .png | `#01caff` |
| .pdf | `#ea355a` |

## Routing
- Default route redirects to `/search/list`
- `search` feature is lazy-loaded, contains nested child routes:
  - `/search/list` → `ListViewComponent` (mail list view)
  - `/search/graph` → `GraphViewComponent` (graph visualization)

## Core Services (in `core/services/`)
- `MockMailService` - Mail data operations (CRUD, starring, read/unread status)
- `MockMailContentService` - Email body content retrieval
- `SelectedMailService` - Shared state for currently selected mail and navigation
- `HighlightService` - Search term highlighting: per-mail highlight state, `highlightText()` and `highlightBodyContent()` for safe HTML marking
- `MockGraphMailService` - Generates ~1000+ mock mails with 40 users for graph visualization
- `GraphDataService` - Builds graph from `Mail[]`: nodes (users), edges (mail connections). Provides `getMailsForNode()` and `getMailsForEdge()`

## Store Structure (in `core/`)
The real application uses NgRx with the following structure, but this mock app does not implement the store - it uses services with signals instead.

State slices: `call`, `tag`, `query`, `router`, `search`

With effects (server calls): `last-search`, `mailbox-mail`, `mails`, `saved-search`

## Angular Signals Pattern
- Use `signal()` for local component state
- Use `computed()` for derived state
- Use `effect()` for reactive side effects (e.g., syncing services)
- Input signals: `$input = input<Type>(defaultValue, { alias: 'inputName' })`
- Output signals: `outputName = output<Type>()`

## Graph View Architecture
The graph canvas (`GraphCanvasComponent`) runs Sigma.js outside Angular's zone (`NgZone.runOutsideAngular()`) for performance. Key patterns:
- **Colors via graph mutations**: Use `graph.updateEachNodeAttributes()` / `updateEachEdgeAttributes()` to change colors — `@sigma/node-border` reads `borderColor` from graph attributes, NOT from Sigma reducers
- **Reducers for visibility only**: Sigma reducers (`nodeReducer`, `edgeReducer`) should only set `hidden: true/false` based on `visibleNodes`
- **Angular zone re-entry**: Sigma event callbacks (clickNode, etc.) must wrap in `NgZone.run()` to trigger change detection
- **Reactivity**: Use `effect()` (not `ngOnChanges`) to react to signal input changes for Sigma updates
- **Web Worker**: `GraphDataService` offloads graph building (node/edge creation, ForceAtlas2 layout) to `features/search/workers/graph-builder.worker.ts`
- **Graph Drawer**: Floating bubble panel that shows mail list + content for selected node/edge. Uses `BubbleOverride` type to display node email or edge from/to emails
- Graph constants defined in `features/search/constants/graph.constants.ts`

## RTL / LTR Handling
The app is globally RTL (`dir="rtl"`), but email-related content (addresses, metadata, attachments) is displayed LTR. Pattern:
- Use `direction: ltr` in SCSS on containers that show English/email content
- Use `dir="rtl"` attribute on inline elements that need to remain RTL within an LTR container (e.g., Hebrew mail count text)
- Use `dir="auto"` on text elements that may contain Hebrew or English (e.g., mail subjects, sender names, recipient values) — lets the Unicode bidi algorithm auto-detect direction

## Scrollbar Rules
- **Global scrollbar appearance** is defined once in `styles.scss` — thin (0.25rem), no arrows, `--color-navy-gray` thumb, transparent track
- **Do NOT add per-component scrollbar appearance rules** (`::webkit-scrollbar` width/track/thumb) — the global rule handles it
- **Right-side positioning**: RTL pages put scrollbars on the left by default. To force right side on scroll containers, add `direction: ltr` on the scroll container and `> * { direction: rtl; }` on its children

## Icon & Text Color Rules
- **Icon default color**: `app-icon` defaults to `var(--color-dark-navy)` — only pass a `color` attribute when you need a non-default color
- **No gray text**: Use `--color-dark-navy` for text color, not `--color-navy-gray`. Keep `--color-navy-gray` only for: disabled states, placeholders, scrollbar thumbs, borders, and decorative elements
- **Conditional icon colors**: In ternary expressions, use `'var(--color-dark-navy)'` as the inactive/default color (not `'var(--color-navy-gray)'`)

## Dropdown Option Colors
- **Hover**: `var(--color-option-hover)` — light blue tint (`rgba(63, 112, 227, 0.1)`)
- **Selected**: `var(--color-option-selected)` — light red tint (`rgba(231, 75, 59, 0.18)`)
- All dropdown/popup option lists must use these colors consistently (no `--color-light-gray` for hover, no `color: blue + bold` for selected)

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
