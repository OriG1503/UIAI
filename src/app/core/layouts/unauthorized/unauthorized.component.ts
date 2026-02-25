import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertButtonComponent } from '../../../features/search-bar/components/molecules/alert-button/alert-button.component';
import { UNAUTHORIZED_LABEL_MAP } from './unauthorized.label-map';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink, AlertButtonComponent],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss',
})
export class UnauthorizedComponent {
  public readonly labels: typeof UNAUTHORIZED_LABEL_MAP = UNAUTHORIZED_LABEL_MAP;

  public onOpenIssue(): void {
    // TODO: connect to real service / NgRx action
    console.log('Open issue clicked');
  }

  public onOpenRequest(): void {
    // TODO: connect to real service / NgRx action
    console.log('Open request clicked');
  }
}
