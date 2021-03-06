import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import * as cookie from 'cookie';

import { User } from '../../models/user';
import { BACKEND_URL, URL } from '../../app-tokens';

/**
 * The AuthService sents requests to and receives responses from the backend, concerning the user authentication.
 * The service is used by the LoginFormComponent, SignupComponent and UserBadgeAndLogoutComponent.
 * It pushes the current username, if any, to subscribers.
 * It also exposes a method to retrieve the current username from the backend, to be used by routing guards. 
 */

interface LoginResponse {
  authUser: boolean;
}
interface LogoutResponse {
  loggedOut: boolean;
}
interface SignupResponse {
  userName: string;
}

@Injectable()
export class AuthService {

  private _username = new BehaviorSubject<string>(undefined);
  public readonly username$ = this._username.asObservable();
  private headers = new HttpHeaders().set('withCredentials', 'true');
  private backendUrl: string;
  public redirectUrl = '/';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(BACKEND_URL) backendUrl: string
  ) {
    this.backendUrl = backendUrl;
    const cookies = cookie.parse(document.cookie);
  }

  public getUsername() {
    return this.http.get<{ username: string }>(this.backendUrl + '/auth/who', {
      headers: this.headers
    })
      .pipe(
        map(res => res.username),
        tap(username => this._username.next(username))
      );
  }

  public login(user: User) {
    return this.http.post<LoginResponse>(this.backendUrl + '/auth/login', user, {
      headers: this.headers
    })
      .pipe(
        map(res => {
          if (res.authUser === true) {
            document.cookie = 'auth=yes; path=/; max-age=3600';
            this._username.next(user.username);
            const routeAndQueryParams = this.routeAndQueryParams(this.redirectUrl);
            this.router.navigate([routeAndQueryParams[0]], routeAndQueryParams[1]);
          }
        })
      );
  }

  public logout() {
    this.http.get<LogoutResponse>(this.backendUrl + '/auth/logout', {
      headers: this.headers
    })
      .subscribe(res => {
        this._username.next(undefined);
        document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        this.router.navigate(['/auth/login']);
      },
        (err: HttpErrorResponse) => alert('Uitloggen mislukt. De database reageert niet. Om uit te loggen kun je ook de browser afsluiten.')
      );
  }

  public signup(user: User) {
    return this.http.post<SignupResponse>(this.backendUrl + '/auth/signup', user, {
      headers: this.headers
    })
      .pipe(
        map(() => this.router.navigate(['/']))
      );
  }

  public clearUsername() {
    this._username.next(undefined);
  }

  private routeAndQueryParams(url: string) {
    const splitUrl = url.split('?');
    const routeFragment = splitUrl[0];
    const queryParams = splitUrl[1];
    if (!queryParams) {
      return [routeFragment];
    } else {
        const queryParamsObj = <any>{queryParams: {}};
        queryParams.split('&')
          .map(keyValue => keyValue.split('='))
          .forEach(([key, value]) => queryParamsObj.queryParams[key] = value);
      return [routeFragment, queryParamsObj];
    }
  }

}