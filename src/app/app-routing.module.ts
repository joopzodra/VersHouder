import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DbManagerComponent } from './db-manager/db-manager.component';
import { AuthGuard } from './auth/services/auth.guard';
import { AuthModule } from './auth/auth.module';
import { PoemsListComponent } from './db-manager/poems-list/poems-list.component';
import { PoetsListComponent } from './db-manager/poets-list/poets-list.component';
import { BundlesListComponent } from './db-manager/bundles-list/bundles-list.component';
import { EditComponent } from './db-manager/edit/edit.component';
import { PoemItemComponent } from './db-manager/poem-item/poem-item.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export function loadAuthModule() {
  return AuthModule;
}

const appRoutes: Routes = [
  {
    path: 'db-manager', canActivate: [AuthGuard], component: DbManagerComponent,
    children: [
      { path: '', redirectTo: 'poems', pathMatch: 'full' },
      {
        path: 'poems', component: PoemsListComponent, data: { title: 'Gedichten' }, children: [
          { path: 'poem/:id', component: PoemItemComponent, data: { title: 'Gedicht' } }
        ]
      },
      { path: 'poets', component: PoetsListComponent, data: { title: 'Dichters' } },
      { path: 'bundles', component: BundlesListComponent, data: { title: 'Gedichtenbundels' } },
  ]},
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
