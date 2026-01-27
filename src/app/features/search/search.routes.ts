import { Routes } from '@angular/router';
import { SearchShellComponent } from './search-shell.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';

export const SEARCH_ROUTES: Routes = [
  {
    path: '',
    component: SearchShellComponent,
    children: [
      { path: 'list', component: ListViewComponent },
      { path: 'graph', component: PlaceholderComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];
