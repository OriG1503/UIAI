import { Component, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { SearchViewType } from '../../../types/search-view-type.type';
import { SEARCH_VIEW_LABEL_MAP, SEARCH_LABEL_MAP } from '../../../mapping/search.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';

@Component({
  selector: 'app-run-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './run-button.component.html',
  styleUrl: './run-button.component.scss',
})
export class RunButtonComponent {
  readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;

  run: OutputEmitterRef<SearchViewType> = output<SearchViewType>();

  $isPopupOpen: WritableSignal<boolean> = signal<boolean>(false);

  readonly viewLabels: typeof SEARCH_VIEW_LABEL_MAP = SEARCH_VIEW_LABEL_MAP;
  readonly translations: typeof SEARCH_LABEL_MAP = SEARCH_LABEL_MAP;

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
