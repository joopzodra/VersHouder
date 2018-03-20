import { NgModule } from '@angular/core';
import { SharedModule } from '../../app/shared/shared.module';

import { DbManagerRoutingModule, dbManagerRoutingComponents } from './db-manager-routing.module';

import { NavigationComponent } from './navigation/navigation.component';
import { SearchComponent } from './search/search.component';
import { PageButtonsComponent } from './page-buttons/page-buttons.component';
import { Alert401Component } from './alert-401/alert-401.component';
import { ForeignKeySearchComponent } from './foreign-key-search/foreign-key-search.component';

import { DbManagerService } from './services/db-manager.service';
import { ListItemsStore } from './services/list-items.store';
import { HideComponentsService } from './services/hide-components.service';
import { PageButtonsService } from './services/page-buttons.service';
import { BACKEND_URL, URL } from '../app-tokens';

@NgModule({
  imports: [
    DbManagerRoutingModule,
    SharedModule
  ],
  declarations: [
    dbManagerRoutingComponents,
    NavigationComponent,
    SearchComponent,
    PageButtonsComponent,
    Alert401Component,
    ForeignKeySearchComponent,
  ],
  providers: [
    DbManagerService,
    ListItemsStore,
    HideComponentsService,
    PageButtonsService,
    { provide: BACKEND_URL, useValue: URL },
  ]
})
export class DbManagerModule { }
