import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import * as cookie from 'cookie';

import { AuthService } from './auth.service';

/* The NotLoggedInGuard allows a user only to navigate to the login or signup components if he's not logged in. Otherwise he's redirected to the app's root page.
 * A user is logged if there is an valid auth-cookie. If this is true, the route is blocked.
 * If there is no valid auth-cookie, there can still be a username. This happens if the user is logged out in another tab or window. In this case this guard calls the AuthService's clearUsername method. And it returns true.
 * Why this guard? Although loggin in twice or creating a new account when already logged in is no problem, we consider it unnessecary. Therefore we block the route and redirect.
 * If the user wants to create another account, he first has to log out.
 */

@Injectable()
export class NotLoggedInGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const cookies = cookie.parse(document.cookie);
    if (cookies.auth && cookies.auth === 'yes') {
      document.cookie = 'auth=yes; path=/; max-age=3600'; // refresh cookie
      this.router.navigate(['/']);
      return false;
    }
    this.authService.clearUsername(); 
    return true;
  }
}
