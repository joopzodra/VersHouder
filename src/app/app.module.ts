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

import { DbManagerService } from './db-manager/services/db-manager.service';
import { ListItemsStore } from './db-manager/services/list-items.store';
import { ForeignKeySearchComponent } from './db-manager/foreign-key-search/foreign-key-search.component';
import { ShowErrorComponent } from './db-manager/show-error/show-error.component';

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
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
  ],
  providers: [
    Title,
    DbManagerService,
    ListItemsStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
