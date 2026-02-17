import { Component, signal } from '@angular/core';
import { SearchBarComponent } from '../../../../search-bar/components/organisms/search-bar/search-bar.component';
import { ThemeToggleComponent } from '../../../../../shared/atoms/theme-toggle/theme-toggle.component';
import { AlertButtonComponent } from '../../../../search-bar/components/molecules/alert-button/alert-button.component';
import { SearchHistoryComponent } from '../../molecules/search-history/search-history.component';
import { SavedSearch } from '../../../types/saved-search.type';
import { LastSearch } from '../../../types/last-search.type';
import { MOCK_SAVED_SEARCHES } from '../../../constants/saved-search.constants';
import { MOCK_LAST_SEARCHES } from '../../../constants/last-search.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent, ThemeToggleComponent, AlertButtonComponent, SearchHistoryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // TODO: replace with store selectors when connecting to server
  $savedSearches = signal<SavedSearch[]>(MOCK_SAVED_SEARCHES);
  $lastSearches = signal<LastSearch[]>(MOCK_LAST_SEARCHES);
  $isSavedSearchLoading = signal<boolean>(false);
  $isLastSearchLoading = signal<boolean>(false);

  public onOpenIssue(): void {
    console.log('Open issue clicked');
  }

  public onOpenRequest(): void {
    console.log('Open request clicked');
  }
}
