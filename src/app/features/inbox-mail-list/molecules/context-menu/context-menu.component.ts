import { Component, input, output, HostListener, ElementRef, inject, computed, AfterViewInit, signal } from '@angular/core';
import { INBOX_TRANSLATIONS } from '../../../../shared';
import { IconComponent } from '../../../../shared/atoms';

const MENU_WIDTH = 160;
const MENU_HEIGHT = 40;
const VIEWPORT_PADDING = 8;

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent implements AfterViewInit {
  private _elementRef = inject(ElementRef);

  $x = input.required<number>({ alias: 'x' });
  $y = input.required<number>({ alias: 'y' });
  markAsUnreadClick = output<void>();
  closeMenu = output<void>();

  readonly translations = INBOX_TRANSLATIONS;

  private _menuDimensions = signal({ width: MENU_WIDTH, height: MENU_HEIGHT });

  $adjustedX = computed(() => {
    const x = this.$x();
    const menuWidth = this._menuDimensions().width;
    const viewportWidth = window.innerWidth;

    if (x + menuWidth + VIEWPORT_PADDING > viewportWidth) {
      return viewportWidth - menuWidth - VIEWPORT_PADDING;
    }
    return x;
  });

  $adjustedY = computed(() => {
    const y = this.$y();
    const menuHeight = this._menuDimensions().height;
    const viewportHeight = window.innerHeight;

    if (y + menuHeight + VIEWPORT_PADDING > viewportHeight) {
      return viewportHeight - menuHeight - VIEWPORT_PADDING;
    }
    return y;
  });

  ngAfterViewInit(): void {
    const menuElement = this._elementRef.nativeElement.querySelector('.context-menu');
    if (menuElement) {
      this._menuDimensions.set({
        width: menuElement.offsetWidth,
        height: menuElement.offsetHeight
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.closeMenu.emit();
    }
  }

  onMarkAsUnread(): void {
    this.markAsUnreadClick.emit();
  }
}
