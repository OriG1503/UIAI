import { Component, signal, WritableSignal } from '@angular/core';
import { SearchBarComponent } from '../../../../search-bar/components/organisms/search-bar/search-bar.component';
import { ThemeToggleComponent } from '../../../../../shared/atoms/theme-toggle/theme-toggle.component';
import { AlertButtonComponent } from '../../../../search-bar/components/molecules/alert-button/alert-button.component';
import { SearchHistoryComponent } from '../../molecules/search-history/search-history.component';
import { SavedSearch } from '../../../types/saved-search.type';
import { LastSearch } from '../../../types/last-search.type';
import { MOCK_SAVED_SEARCHES } from '../../../consts/saved-search.consts';
import { MOCK_LAST_SEARCHES } from '../../../consts/last-search.consts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent, ThemeToggleComponent, AlertButtonComponent, SearchHistoryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // TODO: replace with store selectors when connecting to server
  public $savedSearches: WritableSignal<SavedSearch[]> = signal<SavedSearch[]>(MOCK_SAVED_SEARCHES);
  public $lastSearches: WritableSignal<LastSearch[]> = signal<LastSearch[]>(MOCK_LAST_SEARCHES);
  public $isSavedSearchLoading: WritableSignal<boolean> = signal<boolean>(false);
  public $isLastSearchLoading: WritableSignal<boolean> = signal<boolean>(false);

  public onOpenIssue(): void {
    // TODO: connect to real service / NgRx action
    console.log('Open issue clicked');
  }

  public onOpenRequest(): void {
    // TODO: connect to real service / NgRx action
    console.log('Open request clicked');
  }
}
