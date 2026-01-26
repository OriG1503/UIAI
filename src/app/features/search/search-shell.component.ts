import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchBarComponent } from './organisms/search-bar/search-bar.component';

@Component({
  selector: 'app-search-shell',
  standalone: true,
  imports: [RouterOutlet, SearchBarComponent],
  templateUrl: './search-shell.component.html',
  styleUrl: './search-shell.component.scss',
})
export class SearchShellComponent {}
