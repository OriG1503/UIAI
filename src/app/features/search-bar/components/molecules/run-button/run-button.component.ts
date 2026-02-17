import { Component, output, OutputEmitterRef, signal } from '@angular/core';
import { SearchViewType } from '../../../types/search-view-type.type';
import { SEARCH_VIEW_LABELS, SEARCH_TRANSLATIONS } from '../../../mapping/search.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';

@Component({
  selector: 'app-run-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './run-button.component.html',
  styleUrl: './run-button.component.scss'
})
export class RunButtonComponent {
  readonly ICON_NAMES = ICON_NAMES;

  run: OutputEmitterRef<SearchViewType> = output<SearchViewType>();

  $isPopupOpen = signal(false);

  readonly viewLabels = SEARCH_VIEW_LABELS;
  readonly translations = SEARCH_TRANSLATIONS;

  public openPopup(): void {
    this.$isPopupOpen.set(true);
  }

  public closePopup(): void {
    this.$isPopupOpen.set(false);
  }

  public selectOption(viewType: SearchViewType): void {
    this.run.emit(viewType);
    this.closePopup();
  }
}
