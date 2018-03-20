import { NgModule } from '@angular/core';
import { SharedModule } from '../../app/shared/shared.module';

import { AuthRoutingModule, authRoutingComponents, authRoutingProviders } from './auth-routing.module';

import { AuthService } from './services/auth.service';
import { BACKEND_URL, URL } from '../app-tokens';
import { UserBadgeAndLogoutComponent } from './user-badge-and-logout/user-badge-and-logout.component';

@NgModule({
  imports: [
    AuthRoutingModule,
    SharedModule
  ],
  declarations: [
    authRoutingComponents,
    UserBadgeAndLogoutComponent,
  ],
  providers: [
    AuthService,
    authRoutingProviders,
    {provide: BACKEND_URL, useValue: URL},
  ],
  exports: [UserBadgeAndLogoutComponent]
})
export class AuthModule { }
