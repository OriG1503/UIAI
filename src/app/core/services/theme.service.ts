import { Injectable, signal, WritableSignal } from '@angular/core';

const THEME_STORAGE_KEY: string = 'darkMode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  $isDarkMode: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    const stored: string | null = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'true') {
      this.$isDarkMode.set(true);
      document.documentElement.classList.add('dark-mode');
    }
  }

  toggle(): void {
    const next: boolean = !this.$isDarkMode();
    this.$isDarkMode.set(next);
    if (next) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem(THEME_STORAGE_KEY, String(next));
  }
}
