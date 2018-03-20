import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DbManagerComponent } from './db-manager/db-manager.component';
import { AuthGuard } from './auth/services/auth.guard';
import { PoemsListComponent } from './db-manager/poems-list/poems-list.component';
import { PoetsListComponent } from './db-manager/poets-list/poets-list.component';
import { BundlesListComponent } from './db-manager/bundles-list/bundles-list.component';
import { EditComponent } from './db-manager/edit/edit.component';
import { PoemItemComponent } from './db-manager/poem-item/poem-item.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

/**
 * In the appRoutes, only the ** routes is guarded by the AuthGuard.
 * The DbManagerModule has the authGuard set on its child routes; we don't guard them here.
 * The DbManagerModule is lazy loaded, saving about 25% of initial loading time.
 * The AuthModule cannot be lazy loaded, since it's AuthGuard is needed in the AppModule and the DbManagerModule.
 * The auth route is defined in the AuthRoutingModule. 
 */

const appRoutes: Routes = [
  { path: 'db-manager', loadChildren: 'app/db-manager/db-manager.module#DbManagerModule' },
  { path: '', redirectTo: 'db-manager', pathMatch: 'full' },
  { path: '**', canActivate: [AuthGuard], component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
