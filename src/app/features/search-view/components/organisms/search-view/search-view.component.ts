import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchBarComponent } from '../../../../search-bar/components/organisms/search-bar/search-bar.component';

@Component({
  selector: 'app-search-view',
  standalone: true,
  imports: [RouterOutlet, SearchBarComponent],
  templateUrl: './search-view.component.html',
  styleUrl: './search-view.component.scss',
})
export class SearchViewComponent {}
