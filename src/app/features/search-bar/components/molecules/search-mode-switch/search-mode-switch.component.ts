import {
  Component,
  input,
  output,
  OutputEmitterRef,
  ElementRef,
  inject,
  ViewEncapsulation,
  InputSignal,
} from '@angular/core';
import { SearchModeType } from '../../../types/search-mode-type.type';
import { SEARCH_MODE_LABEL_MAP } from '../../../mapping/search.label-map';
import { GeminiIconComponent } from '../../../../../shared/atoms/gemini-icon/gemini-icon.component';
import { ICON_SIZE_SM } from '../../../../../shared/consts/icon-size.consts';
import {
  EASTER_EGG_ICON_COUNT,
  EASTER_EGG_CENTER_THRESHOLD_PX,
  EASTER_EGG_ICON_SIZE_MIN,
  EASTER_EGG_ICON_SIZE_MAX,
  EASTER_EGG_FALL_DURATION_MIN_S,
  EASTER_EGG_FALL_DURATION_MAX_S,
  EASTER_EGG_SPAWN_SPREAD_S,
} from '../../../consts/easter-egg.consts';

@Component({
  selector: 'app-search-mode-switch',
  standalone: true,
  imports: [GeminiIconComponent],
  templateUrl: './search-mode-switch.component.html',
  styleUrl: './search-mode-switch.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SearchModeSwitchComponent {
  private _elementRef: ElementRef = inject(ElementRef);
  private _isRaining: boolean = false;

  public $mode: InputSignal<SearchModeType> = input<SearchModeType>('regular', { alias: 'mode' });
  public modeChange: OutputEmitterRef<SearchModeType> = output<SearchModeType>();

  public readonly labels: typeof SEARCH_MODE_LABEL_MAP = SEARCH_MODE_LABEL_MAP;
  public readonly ICON_SIZE_SM = ICON_SIZE_SM;

  public onModeSelect(mode: SearchModeType): void {
    this.modeChange.emit(mode);
  }

  public onGeminiClick(event: MouseEvent): void {
    if (this._isRaining) {
      return;
    }

    const iconEl: HTMLElement = this._elementRef.nativeElement.querySelector('.gemini-icon');
    if (!iconEl) {
      return;
    }

    const rect: DOMRect = iconEl.getBoundingClientRect();
    const centerX: number = rect.left + rect.width / 2;
    const centerY: number = rect.top + rect.height / 2;
    const distanceFromCenter: number = Math.sqrt(
      Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2),
    );

    if (distanceFromCenter <= EASTER_EGG_CENTER_THRESHOLD_PX) {
      this._triggerIconRain();
    }
  }

  private _triggerIconRain(): void {
    this._isRaining = true;

    const container: HTMLDivElement = document.createElement('div');
    container.className = 'gemini-rain-container';
    document.body.appendChild(container);

    let finishedCount: number = 0;

    Array.from({ length: EASTER_EGG_ICON_COUNT }).forEach(() => {
      const icon: HTMLImageElement = document.createElement('img');
      icon.src = 'assets/gemini-icon.png';
      icon.className = 'gemini-rain-icon';

      const size: number =
        EASTER_EGG_ICON_SIZE_MIN + Math.random() * (EASTER_EGG_ICON_SIZE_MAX - EASTER_EGG_ICON_SIZE_MIN);
      const leftPos: number = Math.random() * 100;
      const delay: number = Math.random() * EASTER_EGG_SPAWN_SPREAD_S;
      const duration: number =
        EASTER_EGG_FALL_DURATION_MIN_S +
        Math.random() * (EASTER_EGG_FALL_DURATION_MAX_S - EASTER_EGG_FALL_DURATION_MIN_S);
      const rotation: number = Math.random() * 720 - 360;

      icon.style.top = `-${size}px`;
      icon.style.left = `${leftPos}%`;
      icon.style.width = `${size}px`;
      icon.style.height = `${size}px`;
      icon.style.setProperty('--fall-duration', `${duration}s`);
      icon.style.setProperty('--fall-delay', `${delay}s`);
      icon.style.setProperty('--rotation', `${rotation}deg`);

      icon.addEventListener(
        'animationend',
        () => {
          icon.remove();
          finishedCount++;
          if (finishedCount === EASTER_EGG_ICON_COUNT) {
            container.remove();
            this._isRaining = false;
          }
        },
        { once: true },
      );

      container.appendChild(icon);
    });
  }
}
