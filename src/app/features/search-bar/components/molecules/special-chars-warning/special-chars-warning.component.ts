import { Component, output, OutputEmitterRef } from '@angular/core';
import { SEARCH_WARNING_LABEL_MAP } from '../../../mapping/search.label-map';

@Component({
  selector: 'app-special-chars-warning',
  standalone: true,
  templateUrl: './special-chars-warning.component.html',
  styleUrl: './special-chars-warning.component.scss',
})
export class SpecialCharsWarningComponent {
  readonly translations: typeof SEARCH_WARNING_LABEL_MAP = SEARCH_WARNING_LABEL_MAP;

  confirm: OutputEmitterRef<void> = output<void>();

  public onConfirm(): void {
    this.confirm.emit();
  }
}
