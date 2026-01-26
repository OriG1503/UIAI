# Project Conventions

## Overview
Angular 19 client app using mock data instead of a real server.

## Tech Stack
- Angular 19
- Node.js 20.10.0
- npm 10.9.2
- PrimeNG (UI library)
- SCSS for styling

## Folder Structure
```
src/app/
├── core/       # Singleton services, guards, interceptors, store logic, app-wide utilities
├── features/   # Feature modules (lazy-loaded), each feature uses atomic design (atoms/molecules/organisms)
├── shared/     # Reusable atoms, molecules, and shared types (no organisms)
```

## Atomic Design (Component Architecture)
Components in `shared/` follow Atomic Design principles:
- **Atoms** - Basic UI elements (buttons, inputs, icons) - no logic, purely presentational
- **Molecules** - Combinations of atoms - minimal logic if needed
- **Organisms** - Live in `features/`, not in `shared/` - contain most of the business logic

## Conventions
- Use standalone components (Angular 19 default)
- Use `model()` for two-way binding instead of simple signals
- Observable subscriptions should be in components
- Mock data instead of real API calls
- SCSS for component styling
- Barrel exports (index.ts) in each folder
- No spec/test files (.spec.ts) in the project
- Prettier for code formatting (see config file)
- Each type should have its own file
- Prefer `type` over `interface`
- **Every component must have 3 separate files**: `.ts`, `.html`, `.scss` (even if empty)
- **No inline templates/styles**: Always use `templateUrl` and `styleUrl` pointing to external files

## Naming Conventions
- Private members: prefix with `_` (e.g., `_privateVar`)
- Signals: prefix with `$` (e.g., `$count`)
- Booleans: prefix with `is` (e.g., `isActive`, `isAvailable`)

## Code Style
- **No** `let`, `for`, `while` - use `forEach`, `map`, `filter`, etc.
- Clickable elements must use `<button>` tag (not labels, divs, spans)
- Navigation links must use `<a>` tag

## CSS/SCSS Units
- `vh` - only for top-level/root elements
- `%` - for all nested elements
- `rem` - for font sizes, margin, and padding

## Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Red | `#e74b3b` | Buttons, secondary actions |
| Light Gray | `#efefef` | Background |
| Navy Blue/Gray | `#bfc4cd` | Icons |
| White | `#f9fafc` | Date picker background |
| Dark Navy Blue | `#03153a` | Dark elements |
| White | `#ffffff` | Regular background |
| Blue | `#3f70e3` | CC/BCC |
| Orange | `#ffb656` | Favorite star |
| Yellow | `#ffee80` | Highlight |

### Attachment Colors
| Extension | Hex |
|-----------|-----|
| .docx | `#2f67bf` |
| .xlsx | `#219a58` |
| .png | `#01caff` |
| .pdf | `#ea355a` |

## Store Structure (in `core/`)
State slices:
- `call` - call state
- `tag`
- `query`
- `router`
- `search`

With effects (server calls):
- `last-search`
- `mailbox-mail`
- `mails`
- `saved-search`

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
