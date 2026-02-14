import { Injectable, signal } from '@angular/core';

const THEME_STORAGE_KEY = 'darkMode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  $isDarkMode = signal<boolean>(false);

  constructor() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'true') {
      this.$isDarkMode.set(true);
      document.documentElement.classList.add('dark-mode');
    }
  }

  toggle(): void {
    const next = !this.$isDarkMode();
    this.$isDarkMode.set(next);
    if (next) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem(THEME_STORAGE_KEY, String(next));
  }
}
