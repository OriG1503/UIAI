# App Guide — uiai

## 1. What This App Is

`uiai` is a mock Angular 19 client that mirrors the real production application. All data is generated locally — there are no network calls and no real server. It was built to develop and validate UI/UX in isolation before the real NestJS backend and NgRx store are wired in.

Every mock service has a `// TODO:` header explaining what real service replaces it and what HTTP contract it must satisfy.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 19 (standalone components, Signals) |
| UI Library | PrimeNG 19 with Aura preset (dark mode via `.dark-mode` class) |
| Graph | Sigma.js v3 + Graphology; ForceAtlas2 layout; `@sigma/node-border` for bordered nodes |
| Worker | Browser WebWorker (`core/workers/graph-builder.worker.ts`) for graph layout offloading |
| Styling | SCSS, RTL Hebrew UI (`<html lang="he" dir="rtl">`) |
| Theme | Dark mode via `ThemeService` with localStorage persistence |
| Font | Custom "Ploni" font |

---

## 3. Folder Structure

```
src/app/
├── core/
│   ├── services/       # App-wide singleton services (mock + real)
│   ├── routes/         # Routed view components (ListViewComponent, GraphViewComponent)
│   └── workers/        # WebWorker: graph-builder.worker.ts
├── features/           # Feature modules, each with atomic design layers
│   └── <feature>/
│       ├── atoms/          # Basic UI elements (no logic)
│       ├── molecules/      # Combinations of atoms (minimal logic)
│       ├── organisms/      # Business logic components
│       ├── types/          # Feature-specific types (one file per type)
│       ├── consts/         # Feature-specific constants (*.consts.ts)
│       └── mapping/        # Hebrew translation maps (*.label-map.ts)
├── shared/
│   ├── atoms/          # Cross-feature UI atoms (Icon, ThemeToggle)
│   ├── types/          # Cross-feature types (Mail, MailUserInfo, SortDirection)
│   ├── consts/         # Cross-feature constants (icon-name.consts.ts)
│   ├── mapping/        # Cross-feature translations (common, inbox label-maps)
│   └── pipes/          # Cross-feature pipes (HighlightTextPipe)
└── environments/
    ├── environment.ts              # Production config (apiBaseUrl)
    └── environment.development.ts  # Development config (localhost:3000)
```

---

## 4. Routing

| URL | Component | Description |
|-----|-----------|-------------|
| `/` | `HomeComponent` | Landing page: last searches + saved searches |
| `/search/*` | `SearchViewComponent` | Shell with SearchBar + `<router-outlet>` |
| `/search/list` | `ListViewComponent` | Mail list + content split view |
| `/search/graph` | `GraphViewComponent` | Graph visualization + drawer + filters |

`SearchViewComponent` (organism in `features/search-view`) acts as a layout shell. The actual mail content view is nested inside it via child routes.

---

## 5. Core Services

All services live in `core/services/`. Each mock service has a `// TODO:` comment at the top describing its replacement contract.

### MockMailService
Provides the inbox mail list as a signal. Exposes `markAsSeen` / `markAsUnseen` for read-status updates.
- **Real replacement**: a service that calls `GET /mails`, `PATCH /mails/:filename/seen|unseen`
- **Public API**: `mails: Signal<Mail[]>`, `userEmail: string`, `markAsSeen(filename)`, `markAsUnseen(filename)`

### MockGraphMailService
Generates ~1000 mails across 40 users for graph visualization.
- **Real replacement**: a service that calls `GET /graph/mails`
- **Public API**: same shape as `MockMailService`

### MockMailContentService
Returns HTML body content for a given mail filename.
- **Real replacement**: a service that calls `GET /mails/:filename/content`
- **Public API**: `getMailContent(filename: string): string`

### MockTagService
Simulates async tag search with a debounce delay.
- **Real replacement**: a service that calls `GET /tags?q=<searchText>`
- **Public API**: `$isLoading: WritableSignal<boolean>`, `$filteredTags: WritableSignal<TagOption[]>`, `search(text)`, `reset()`

### SelectedMailService
Shared state for the currently selected mail. Bridges regular mail list and graph drawer. Handles `markAsSeen` routing to the right mail service.

### HighlightService
Manages search-term highlight state per mail. Provides `highlightText()` and `highlightBodyContent()` for safe HTML marking.

### GraphDataService
Builds a Graphology graph from `Mail[]`: nodes are users, edges are mail connections. Provides `getMailsForNode()` and `getMailsForEdge()`.

### ThemeService
Toggles dark mode class on `<html>` and persists preference to `localStorage`.

---

## 6. Feature Breakdown

### `home`
Landing page showing last searches and saved searches. Uses mock signal arrays (`$savedSearches`, `$lastSearches`) that will be replaced by NgRx store selectors. `onOpenIssue()` and `onOpenRequest()` are stubs waiting for real service integration.

### `search-view`
Layout shell for the search experience. Renders the `SearchBarComponent` at the top and a `<router-outlet>` for the active child view (list or graph).

### `search-bar`
The main search toolbar. Handles tag filtering (multi-select dropdown), date range picking, search mode toggle (regular/semantic), text input, and run button. `onAdvancedClick()`, `onOpenIssue()`, `onOpenRequest()`, and the search dispatch log are stubs waiting for NgRx actions.

### `inbox-mail-list`
Displays a filterable, sortable list of mail previews. Supports select mode for CSV export. Handles context menu for mark-as-unseen. `onTranslateClick()` is a stub.

### `mail-content`
Shows the full content of the selected mail: metadata (from/to/cc/bcc/date), attachments, and HTML body. Supports encoding toggle and highlight navigation (previous/next). `onDownloadMail()`, `onDownloadAllAttachments()`, and `onDownloadAttachment()` are stubs.

### `graph-canvas`
Renders the Sigma.js graph. Runs outside Angular's zone for performance. Handles node/edge click events (wrapping back into `NgZone.run()`), color updates via graph mutations, and visibility via Sigma reducers. Pre-config (bordered node program, custom label drawing) lives in `graph-canvas-rendering.ts`.

### `graph-filters`
Sidebar panel for filtering the graph view: date range, mail count range, and tag filter. Communicates filter state to `GraphViewComponent` via output signals.

---

## 7. Graph Architecture

### WebWorker Flow
1. `GraphViewComponent` sends `Mail[]` to `graph-builder.worker.ts` via `postMessage`.
2. The worker builds a Graphology graph (nodes = users, edges = connections), runs ForceAtlas2 layout, and applies overlap prevention.
3. The worker returns computed node positions back to the main thread.
4. `GraphDataService` provides `getMailsForNode(email)` and `getMailsForEdge(from, to)` for the drawer.

### Sigma.js Zone Pattern
- All Sigma setup runs inside `NgZone.runOutsideAngular()` to prevent unnecessary change detection.
- Event callbacks (`clickNode`, `clickEdge`, etc.) wrap their Angular state updates in `NgZone.run()`.

### Color Updates
- **Use graph mutations** (`graph.updateEachNodeAttributes()`, `graph.updateEachEdgeAttributes()`) to change colors — `@sigma/node-border` reads `borderColor` from graph attributes.
- **Do NOT use Sigma reducers for color** — reducers are reserved for `hidden: true/false` visibility only.

### Reactivity
- Use `effect()` (not `ngOnChanges`) to react to signal input changes and trigger Sigma updates.

---

## 8. NgRx Integration Plan

When connecting to the real app, add NgRx providers to `src/app/app.config.ts` (the placeholder comment block is already there):

```typescript
// provideStore(reducers),
// provideEffects(effects),
// provideRouterStore(),
```

**Expected state slices**: `call`, `tag`, `query`, `router`, `search`

**Expected effects** (server calls): `last-search`, `mailbox-mail`, `mails`, `saved-search`

**Services replaced by store selectors**:
- `HomeComponent.$savedSearches` / `$lastSearches` → `saved-search` and `last-search` selectors
- `MailListComponent` mail list → `mails` selector
- Tag search → `tag` store slice with `search` effect

---

## 9. Connecting to Real Server

Follow these steps for each mock service:

1. **Implement the real service** in the same folder (`core/services/`) matching the mock's public API (same signal names, same method signatures). Inject `HttpClient` and call the NestJS endpoints documented in the `// TODO:` header of each mock file.

2. **Copy the real service** into `core/services/` alongside the mock (or replace it).

3. **Update injection sites** — find all places that inject the mock and change the type to the real service. Since both share the same public API shape, the component code needs no further changes.

4. **Uncomment NgRx** in `app.config.ts` and wire up the store slices and effects.

5. **Set `apiBaseUrl`** in `src/environments/environment.ts` (production) and `src/environments/environment.development.ts` (local). The dev server already uses `fileReplacements` to swap the dev file in during `ng serve`.

---

## 10. Key Patterns

### RTL / LTR Handling
The app is globally RTL. Email addresses, metadata, and attachments use `direction: ltr` on their containers. Use `dir="auto"` on subject/sender text to let the Unicode bidi algorithm choose. Use `dir="rtl"` on inline Hebrew elements inside LTR containers.

### Signals Pattern
```typescript
// Local state
$count = signal(0);

// Derived state
$doubled = computed(() => this.$count() * 2);

// Side effects
effect(() => { doSomethingWith(this.$count()); });

// Component inputs/outputs
$value = input<string>('', { alias: 'value' });
changed = output<string>();
```

### PrimeNG Overrides
Use `ViewEncapsulation.None` on the component that needs to override PrimeNG styles. Add the override in that component's SCSS file scoped to the component selector — never in `styles.scss`.

### SCSS Hierarchy Rule
SCSS nesting must mirror the HTML structure exactly. No `!important`. No global styles (exception: scrollbar appearance and CSS variables in `styles.scss`).

### Translation / Label-Map Pattern
All user-facing text (especially Hebrew) lives in `*.label-map.ts` files in each feature's `mapping/` folder. Type the object as `typeof LABEL_MAP` (not `Record<string, string>`) to preserve template dot-access autocompletion.

```typescript
// mapping/search.label-map.ts
export const SEARCH_LABEL_MAP = {
  placeholder: 'חפש...',
  runButton: 'הפעל',
} as const;

// In component
readonly labels: typeof SEARCH_LABEL_MAP = SEARCH_LABEL_MAP;
// In template: {{ labels.placeholder }}
```
