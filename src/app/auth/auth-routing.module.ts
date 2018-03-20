import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './services/auth.guard';
import { NotLoggedInGuard } from './services/not-logged-in.guard';

import { AuthComponent } from './auth.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';

const authRoutes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', canActivate: [NotLoggedInGuard], component: LoginFormComponent, data: { title: 'Inloggen' } },
      { path: 'signup', canActivate: [NotLoggedInGuard], component: SignupFormComponent, data: { title: 'Aanmelden' } },
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }

export const authRoutingComponents = [AuthComponent, LoginFormComponent, SignupFormComponent];
export const authRoutingProviders = [AuthGuard, NotLoggedInGuard];
