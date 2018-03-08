import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DbManagerComponent } from './db-manager/db-manager.component';
import { NavigationComponent } from './db-manager/navigation/navigation.component';
import { SearchComponent } from './db-manager/search/search.component';
import { PoemsListComponent } from './db-manager/poems-list/poems-list.component';
import { PoetsListComponent } from './db-manager/poets-list/poets-list.component';
import { BundlesListComponent } from './db-manager/bundles-list/bundles-list.component';
import { EditComponent } from './db-manager/edit/edit.component';
import { PoemItemComponent } from './db-manager/poem-item/poem-item.component';
import { ShowErrorComponent } from './db-manager/show-error/show-error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { Alert401Component } from './db-manager/alert-401/alert-401.component';

import { DbManagerService } from './db-manager/services/db-manager.service';
import { ListItemsStore } from './db-manager/services/list-items.store';
import { ForeignKeySearchComponent } from './db-manager/foreign-key-search/foreign-key-search.component';
import { HideComponentsService } from './db-manager/services/hide-components.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DbManagerComponent,
    NavigationComponent,
    SearchComponent,
    PoemsListComponent,
    PoetsListComponent,
    BundlesListComponent,
    EditComponent,
    PoemItemComponent,
    ForeignKeySearchComponent,
    ShowErrorComponent,
    PageNotFoundComponent,
    Alert401Component,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule,
    AppRoutingModule,
  ],
  providers: [
    Title,
    DbManagerService,
    ListItemsStore,
    HideComponentsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
