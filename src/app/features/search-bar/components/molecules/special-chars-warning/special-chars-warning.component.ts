import { Component, output } from '@angular/core';
import { SEARCH_WARNING_TRANSLATIONS } from '../../../mapping/search.label-map';

@Component({
  selector: 'app-special-chars-warning',
  standalone: true,
  templateUrl: './special-chars-warning.component.html',
  styleUrl: './special-chars-warning.component.scss'
})
export class SpecialCharsWarningComponent {
  readonly translations = SEARCH_WARNING_TRANSLATIONS;

  confirm = output<void>();

  public onConfirm(): void {
    this.confirm.emit();
  }
}
