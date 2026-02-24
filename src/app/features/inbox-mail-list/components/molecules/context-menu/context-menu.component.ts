import {
  Component,
  input,
  output,
  OutputEmitterRef,
  HostListener,
  ElementRef,
  inject,
  computed,
  AfterViewInit,
  signal,
  InputSignal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { INBOX_LABEL_MAP } from '../../../../../shared/mapping/inbox.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { ICON_SIZE_MD } from '../../../../../shared/consts/icon-size.consts';
import { MENU_WIDTH, MENU_HEIGHT, VIEWPORT_PADDING } from '../../../consts/context-menu.consts';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent implements AfterViewInit {
  private _elementRef: ElementRef = inject(ElementRef);

  public $x: InputSignal<number> = input.required<number>({ alias: 'x' });
  public $y: InputSignal<number> = input.required<number>({ alias: 'y' });
  public markAsUnreadClick: OutputEmitterRef<void> = output<void>();
  public closeMenu: OutputEmitterRef<void> = output<void>();

  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_MD = ICON_SIZE_MD;
  public readonly translations: typeof INBOX_LABEL_MAP = INBOX_LABEL_MAP;

  private _menuDimensions: WritableSignal<{ width: number; height: number }> = signal<{
    width: number;
    height: number;
  }>({ width: MENU_WIDTH, height: MENU_HEIGHT });

  public $adjustedX: Signal<number> = computed<number>(() => {
    const x: number = this.$x();
    const menuWidth: number = this._menuDimensions().width;
    const viewportWidth: number = window.innerWidth;

    if (x + menuWidth + VIEWPORT_PADDING > viewportWidth) {
      return viewportWidth - menuWidth - VIEWPORT_PADDING;
    }
    return x;
  });

  public $adjustedY: Signal<number> = computed<number>(() => {
    const y: number = this.$y();
    const menuHeight: number = this._menuDimensions().height;
    const viewportHeight: number = window.innerHeight;

    if (y + menuHeight + VIEWPORT_PADDING > viewportHeight) {
      return viewportHeight - menuHeight - VIEWPORT_PADDING;
    }
    return y;
  });

  public ngAfterViewInit(): void {
    const menuElement: HTMLElement | null = this._elementRef.nativeElement.querySelector('.context-menu');
    if (menuElement) {
      this._menuDimensions.set({
        width: menuElement.offsetWidth,
        height: menuElement.offsetHeight,
      });
    }
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.closeMenu.emit();
    }
  }

  public onMarkAsUnread(): void {
    this.markAsUnreadClick.emit();
  }
}
