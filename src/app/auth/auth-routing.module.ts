import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './services/auth.guard';

import { AuthComponent } from './auth.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
//import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

const authRoutes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginFormComponent, data: { title: 'Inloggen' } },
      { path: 'signup', component: SignupFormComponent, data: { title: 'Aanmelden' } },
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      /* { path: '**', component: PageNotFoundComponent, canActivate: [AuthGuard] }*/
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

export const authRoutingComponents = [AuthComponent, LoginFormComponent, SignupFormComponent]; //PageNotFoundComponent is already imported in app.module
