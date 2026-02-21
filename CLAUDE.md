# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Angular 19 client app using mock data instead of a real server. Hebrew (RTL) UI with `<html lang="he" dir="rtl">`. Custom "Ploni" font.

## Tech Stack
- Angular 19
- Node.js 20.10.0
- npm 10.9.2
- PrimeNG 19 with **Aura** preset theme (dark mode via `.dark-mode` class selector, managed by `ThemeService` with localStorage persistence)
- SCSS for styling
- Sigma.js v3 + Graphology for graph visualization (ForceAtlas2 layout, `@sigma/node-border` for bordered nodes)

## Commands
```bash
npm start        # Start dev server (http://localhost:4200)
npm run build    # Production build
npm run watch    # Incremental dev build (watch mode)
npm test         # Run unit tests with Karma
```

## Folder Structure
```
src/app/
├── core/           # Singleton services, guards, interceptors, store logic, app-wide utilities
│   ├── services/       # App-wide services (MockMailService, SelectedMailService, etc.)
│   ├── routes/         # View components for routes (ListViewComponent, GraphViewComponent)
│   └── workers/        # Web Workers (graph-builder.worker.ts)
├── features/       # Feature modules (lazy-loaded), each feature owns its own atomic design layers
│   └── <feature>/  # home, search-view, search-bar, inbox-mail-list, mail-content, graph-canvas, graph-filters
│       ├── atoms/          # Feature-specific basic UI elements
│       ├── molecules/      # Feature-specific combinations of atoms
│       ├── organisms/      # Business logic components
│       ├── types/          # Feature-specific types (each type in its own file)
│       ├── consts/         # Feature-specific constants
│       └── mapping/        # Feature-specific translation maps (*.label-map.ts)
├── shared/         # Only truly cross-feature items (used by 2+ features)
│   ├── atoms/      # Global basic UI elements (e.g., Icon, ThemeToggle)
│   ├── types/      # Cross-feature types (Mail, MailUserInfo, HighlightMatch, SortDirection)
│   ├── consts/     # Cross-feature constants (e.g., icon-name.consts.ts with all PrimeIcon names)
│   ├── mapping/    # Cross-feature translations (common.label-map.ts, inbox.label-map.ts)
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
- **No magic numbers**: All numeric constants must be defined in the feature's `consts/` folder (or `shared/consts/` if cross-feature)
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
- Prettier for code formatting: `semi: true`, `arrowParens: always`, `useTabs: false`, `bracketSpacing: true`,`printWidth: 120`, `singleQuote: true`, `trailingComma: "all"`, `tabWidth: 2`, `singleAttributePerLine: true`
- Each type should have its own file in the owning feature's `types/` folder (or `shared/types/` only if used by 2+ features)
- Prefer `type` over `interface`
- **Every component must have 3 separate files**: `.ts`, `.html`, `.scss` (even if empty)
- **No inline templates/styles**: Always use `templateUrl` and `styleUrl` pointing to external files
- **Multiple SCSS files**: A component may declare `styleUrl` as an array for compositional styling (e.g., `[component.scss, floating-icons.scss]`)

## SCSS Rules
- **Mirror HTML hierarchy**: SCSS nesting must match the HTML structure exactly
- **No global styles**: Avoid adding styles to `styles.scss` - use component styles instead (exception: scrollbar appearance and CSS variables are defined globally)
- **No !important**: Use `ViewEncapsulation.None` at component level for PrimeNG overrides
- **Component encapsulation**: Each component handles its own PrimeNG overrides

## Naming Conventions
- Private members: prefix with `_` (e.g., `_privateVar`)
- Signals: prefix with `$` (e.g., `$count`); private signals use `_$` (e.g., `private _$internalState`)
- **Constants files**: `*.consts.ts` in `consts/` folders (e.g., `graph.consts.ts`)
- Booleans: prefix with `is` (e.g., `isActive`, `isAvailable`)
- **File names**: lowercase with single hyphen separator (e.g., `search-bar.component.ts`)
- **CSS classes**: lowercase with single hyphen separator, no IDs (e.g., `.search-bar`, `.field-text`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_VERBAL_DATE_AMOUNT`)
- **Translation keys**: camelCase matching the context (e.g., `dateRangeLabels`, `buttonLabels`)
- **Translation files**: `*.label-map.ts` in `mapping/` folders (e.g., `search.label-map.ts`)
- **Label map typing**: Type as `typeof LABEL_MAP` (not `Record<string, string>`) when accessed in templates via dot-notation — this preserves autocomplete and type safety. Use `Record<UnionType, string>` only when the map is keyed by a discriminated union type for programmatic lookup.

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
- `/` → `HomeComponent` (search history landing page: last searches + saved searches)
- `/search/*` → `SearchViewComponent` (pure layout shell in `features/search-view`: renders `SearchBarComponent` + `<router-outlet>`), with nested child routes:
  - `/search/list` → `ListViewComponent` (mail list + content split view)
  - `/search/graph` → `GraphViewComponent` (graph visualization + drawer + filters)
  - `/search` → redirects to `/search/list`

Child routes are defined in `core/routes/search.routes.ts`.

## Core Services (in `core/services/`)
- `MockMailService` - Mail data operations (CRUD, starring, read/unread status)
- `MockMailContentService` - Email body content retrieval
- `MockTagService` - Tag CRUD operations
- `SelectedMailService` - Shared state for currently selected mail and navigation. Dispatches `markAsSeen` to the correct service based on filename prefix: filenames starting with `'graph-mail-'` route to `MockGraphMailService`, all others to `MockMailService`
- `HighlightService` - Search term highlighting: per-mail highlight state, `highlightText()` and `highlightBodyContent()` for safe HTML marking
- `MockGraphMailService` - Generates ~1000+ mock mails with 40 users for graph visualization
- `GraphDataService` - Builds graph from `Mail[]`: nodes (users), edges (mail connections). Provides `getMailsForNode()` and `getMailsForEdge()`
- `ThemeService` - Dark mode toggle with localStorage persistence

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
- **Web Worker**: `GraphDataService` offloads graph building (node/edge creation, ForceAtlas2 layout) to `core/workers/graph-builder.worker.ts`
- **Graph Drawer**: Floating bubble panel that shows mail list + content for selected node/edge. Uses `GraphSelectionInfo` type to display node email or edge from/to emails
- **Pre-config extraction**: Sigma rendering setup (BorderedNodeProgram, `drawCustomLabel`, canvas envelope icon) lives in `graph-canvas-rendering.ts` alongside the component — not inside the component class
- Graph constants defined in `features/graph-canvas/consts/graph.consts.ts`

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

## PrimeNG Override Patterns

### Button hover background
Class-based selectors (even with higher specificity) can be beaten by PrimeNG Aura's button hover rules. **Always use CSS custom properties** set on a container element instead:
```scss
.p-datepicker {
  --p-button-text-hover-background: rgba(231, 75, 59, 0.15);
  --p-button-text-primary-hover-background: rgba(231, 75, 59, 0.15);
  --p-button-text-primary-color: var(--color-dark-navy);
  --p-button-text-hover-color: var(--color-dark-navy);
}
```
Cover both `--p-button-text-hover-background` (default) and `--p-button-text-primary-hover-background` (primary-variant) since which one PrimeNG applies depends on the button's color variant.

### HostListener + PrimeNG DOM re-renders
When a `@HostListener('document:click')` is used to close a popup, PrimeNG components that switch views (e.g. DatePicker switching to month/year picker) destroy the clicked element before the listener fires. The detached element is no longer `contains()`-able, causing a false popup-close. Guard with:
```ts
public onDocumentClick(event: Event): void {
  const target = event.target as HTMLElement;
  if (!target.isConnected) {
    return;
  }
  if (!this._elementRef.nativeElement.contains(target)) {
    this.$isPopupOpen.set(false);
  }
}
```

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
