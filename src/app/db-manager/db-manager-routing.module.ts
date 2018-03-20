import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DbManagerComponent } from './db-manager.component';
import { PoemsListComponent } from './poems-list/poems-list.component';
import { PoetsListComponent } from './poets-list/poets-list.component';
import { BundlesListComponent } from './bundles-list/bundles-list.component';
import { EditComponent } from './edit/edit.component';
import { PoemItemComponent } from './poem-item/poem-item.component';

import { AuthGuard } from '../auth/services/auth.guard';

/**
 * In the dbManagerRoutes, all routes are guarded by the AuthGuard. 
 * The AuthGuard is set on every db-manager childroute separately. It could have been set on the 'db-manager' parent route instead of on all the children. But then the AuthGuard isn't called when we navigate from child to child. 
 * We want the AuthGuard to be called on every navigation, because the AuthGuard refreshes the auth-cookie. Since every child receives fresh data from the backend, the backend refreshed the session cookie. We want the auth-cookie and session-cookie to be refreshed simulaniously, so we don't need to handle cases when one is expired while the other is still valid.
 */
const dbManagerRoutes: Routes = [
  {
    path: '', component: DbManagerComponent,
    children: [
      { path: '', redirectTo: 'poems', pathMatch: 'full' },
      {
        path: 'poems', canActivate: [AuthGuard], component: PoemsListComponent, data: { title: 'Gedichten' }, children: [
          { path: 'poem/:id', component: PoemItemComponent, data: { title: 'Gedicht' } }
        ]
      },
      { path: 'poets', canActivate: [AuthGuard], component: PoetsListComponent, data: { title: 'Dichters' } },
      { path: 'bundles', canActivate: [AuthGuard], component: BundlesListComponent, data: { title: 'Gedichtenbundels' } },
  ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(dbManagerRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DbManagerRoutingModule { };
export const dbManagerRoutingComponents = [DbManagerComponent, PoemsListComponent, PoetsListComponent, BundlesListComponent, EditComponent, PoemItemComponent]
