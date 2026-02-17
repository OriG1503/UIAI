import { Component } from '@angular/core';
import { SearchBarComponent } from '../../../features/search-bar/components/organisms/search-bar/search-bar.component';
import { ThemeToggleComponent } from '../../../shared/atoms/theme-toggle/theme-toggle.component';
import { AlertButtonComponent } from '../../../features/search-bar/components/molecules/alert-button/alert-button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent, ThemeToggleComponent, AlertButtonComponent],
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
