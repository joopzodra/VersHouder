import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { AuthModule } from './auth/auth.module';
import { AppRoutingModule, appRoutingComponents } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { DbManagerService } from './db-manager/services/db-manager.service';
import { SearchComponent } from './db-manager/search/search.component';
import { PoemsListComponent } from './db-manager/poems-list/poems-list.component';
import { NavigationComponent } from './db-manager/navigation/navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    appRoutingComponents,
    HeaderComponent,
    SearchComponent,
    PoemsListComponent,
    NavigationComponent,
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
    DbManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
