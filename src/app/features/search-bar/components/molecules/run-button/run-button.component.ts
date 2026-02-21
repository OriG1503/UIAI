import { Component, output, OutputEmitterRef } from '@angular/core';
import { SearchViewType } from '../../../types/search-view-type.type';
import { SEARCH_VIEW_LABEL_MAP, SEARCH_LABEL_MAP } from '../../../mapping/search.label-map';
import { HoverPopupComponent } from '../../../../../shared/molecules/hover-popup/hover-popup.component';
import { PopupOption } from '../../../../../shared/types/popup-option.type';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';

@Component({
  selector: 'app-run-button',
  standalone: true,
  imports: [HoverPopupComponent],
  templateUrl: './run-button.component.html',
  styleUrl: './run-button.component.scss',
})
export class RunButtonComponent {
  readonly translations: typeof SEARCH_LABEL_MAP = SEARCH_LABEL_MAP;
  readonly popupOptions: PopupOption[] = [
    { value: 'list', label: SEARCH_VIEW_LABEL_MAP.list, icon: ICON_NAMES.LIST },
    { value: 'graph', label: SEARCH_VIEW_LABEL_MAP.graph, icon: ICON_NAMES.CHART_BAR },
  ];

  run: OutputEmitterRef<SearchViewType> = output<SearchViewType>();

  public onViewSelect(value: string): void {
    this.run.emit(value as SearchViewType);
  }
}
