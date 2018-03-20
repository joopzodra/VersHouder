import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { AuthRoutingModule, authRoutingComponents, authRoutingProviders } from './auth-routing.module';

import { ShowErrorComponent } from './show-error/show-error.component';

import { AuthService } from './services/auth.service';
import { BACKEND_URL, URL } from '../app-tokens';
import { UserBadgeAndLogoutComponent } from './user-badge-and-logout/user-badge-and-logout.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthRoutingModule
  ],
  declarations: [
    authRoutingComponents,
    ShowErrorComponent,
    UserBadgeAndLogoutComponent,
  ],
  providers: [
    AuthService,
    authRoutingProviders,
    {provide: BACKEND_URL, useValue: URL},
    Title
  ],
  exports: [UserBadgeAndLogoutComponent]
})
export class AuthModule { }

//exports isn't for services. Adding the services to providers is enough. So don't need to export AuthService and AuthGuard
