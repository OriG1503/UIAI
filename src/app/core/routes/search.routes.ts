import { Routes } from '@angular/router';
import { ListViewComponent } from './list-view/list-view.component';
import { GraphViewComponent } from './graph-view/graph-view.component';

export const SEARCH_ROUTES: Routes = [
  { path: 'list', component: ListViewComponent },
  { path: 'graph', component: GraphViewComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
