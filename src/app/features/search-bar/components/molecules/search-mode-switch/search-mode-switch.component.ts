import { Component, input, output, OutputEmitterRef, ElementRef, inject } from '@angular/core';
import { SearchModeType } from '../../../types/search-mode-type.type';
import { SEARCH_MODE_LABELS } from '../../../mapping/search.label-map';
import { GeminiIconComponent } from '../../../../../shared/atoms/gemini-icon/gemini-icon.component';
import {
  EASTER_EGG_ICON_COUNT,
  EASTER_EGG_CENTER_THRESHOLD_PX,
  EASTER_EGG_ICON_SIZE_MIN,
  EASTER_EGG_ICON_SIZE_MAX,
  EASTER_EGG_FALL_DURATION_MIN_S,
  EASTER_EGG_FALL_DURATION_MAX_S,
  EASTER_EGG_SPAWN_SPREAD_S
} from '../../../constants/easter-egg.constants';

@Component({
  selector: 'app-search-mode-switch',
  standalone: true,
  imports: [GeminiIconComponent],
  templateUrl: './search-mode-switch.component.html',
  styleUrl: './search-mode-switch.component.scss',
})
export class SearchModeSwitchComponent {
  private _elementRef = inject(ElementRef);
  private _isRaining = false;

  $mode = input<SearchModeType>('regular', { alias: 'mode' });
  modeChange: OutputEmitterRef<SearchModeType> = output<SearchModeType>();

  readonly labels = SEARCH_MODE_LABELS;

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

    const rect = iconEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceFromCenter = Math.sqrt(
      Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2)
    );

    if (distanceFromCenter <= EASTER_EGG_CENTER_THRESHOLD_PX) {
      this._triggerIconRain();
    }
  }

  private _triggerIconRain(): void {
    this._isRaining = true;

    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden';
    document.body.appendChild(container);

    if (!document.getElementById('gemini-rain-style')) {
      const style = document.createElement('style');
      style.id = 'gemini-rain-style';
      style.textContent = `
        @keyframes gemini-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.85; }
          80% { opacity: 0.7; }
          100% { transform: translateY(calc(100vh + 50px)) rotate(var(--rotation)); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    let finishedCount = 0;

    Array.from({ length: EASTER_EGG_ICON_COUNT }).forEach(() => {
      const icon = document.createElement('img');
      icon.src = 'assets/gemini-icon.png';

      const size = EASTER_EGG_ICON_SIZE_MIN + Math.random() * (EASTER_EGG_ICON_SIZE_MAX - EASTER_EGG_ICON_SIZE_MIN);
      const leftPos = Math.random() * 100;
      const delay = Math.random() * EASTER_EGG_SPAWN_SPREAD_S;
      const duration = EASTER_EGG_FALL_DURATION_MIN_S + Math.random() * (EASTER_EGG_FALL_DURATION_MAX_S - EASTER_EGG_FALL_DURATION_MIN_S);
      const rotation = Math.random() * 720 - 360;

      icon.style.cssText = `position:absolute;top:-${size}px;left:${leftPos}%;width:${size}px;height:${size}px;opacity:0.85;animation:gemini-fall ${duration}s ${delay}s ease-in forwards`;
      icon.style.setProperty('--rotation', `${rotation}deg`);

      icon.addEventListener('animationend', () => {
        icon.remove();
        finishedCount++;
        if (finishedCount === EASTER_EGG_ICON_COUNT) {
          container.remove();
          this._isRaining = false;
        }
      }, { once: true });

      container.appendChild(icon);
    });
  }
}
