import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
    // ── NgRx Store (uncomment when connecting real app) ──────────────────────────
    // provideStore(reducers),
    // provideEffects(effects),
    // provideRouterStore(),
    // Expected state slices: call, tag, query, router, search
    // Expected effects: last-search, mailbox-mail, mails, saved-search
    // ─────────────────────────────────────────────────────────────────────────────
  ],
};
