import { Component } from '@angular/core';
import { SearchBarComponent } from '../../../../search-bar/components/organisms/search-bar/search-bar.component';
import { ThemeToggleComponent } from '../../../../../shared/atoms/theme-toggle/theme-toggle.component';
import { AlertButtonComponent } from '../../../../search-bar/components/molecules/alert-button/alert-button.component';
import { SearchHistoryComponent } from '../../molecules/search-history/search-history.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent, ThemeToggleComponent, AlertButtonComponent, SearchHistoryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public onOpenIssue(): void {
    console.log('Open issue clicked');
  }

  public onOpenRequest(): void {
    console.log('Open request clicked');
  }
}
