import { Routes } from '@angular/router';
import { SearchShellComponent } from './search-shell.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';

export const SEARCH_ROUTES: Routes = [
  {
    path: '',
    component: SearchShellComponent,
    children: [
      { path: 'list', component: PlaceholderComponent },
      { path: 'graph', component: PlaceholderComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];
