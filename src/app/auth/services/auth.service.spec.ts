import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { StubRouter } from '../../testing/stub-router';
import { BACKEND_URL, URL } from '../../app-tokens';

describe('AuthService', () => {

  let service: AuthService;
  let httpMock: HttpTestingController;
  //let http: HttpClient;
  let router: Router;

  beforeEach(() => {
    // After succesfull login a cookie is set. When it's set, a new instance of AuthService calls the server to get the username. We must prevent this call, since it makes all tests fail. Therefore delete the cookie before each new instance.
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        AuthService,
        { provide: Router, useClass: StubRouter },
        { provide: BACKEND_URL, useValue: URL }
      ]
    });
  });

  beforeEach(inject([AuthService, /*HttpClient,*/ HttpTestingController, Router], (_service: AuthService, /*_http: HttpClient,*/ _httpMock: HttpTestingController, _router: Router) => {
    service = _service;
    httpMock = _httpMock;
    //http = _http;
    router = _router;
  }));

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('logs in', async(() => {
    let userName;
    service.username$.subscribe(username => userName = username);
    expect(userName).toBe(undefined);
    const spy = spyOn(router, 'navigate');
    service.login({ username: 'good-user', password: 'secret' })
      .subscribe(() => { });
    const req = httpMock.expectOne(service['backendUrl'] + '/auth/login');
    req.flush({ authUser: true });
    expect(spy).toHaveBeenCalledWith(['/']);
    expect(userName).toBe('good-user');
  }));

  it('handles login errors', async(() => {
    const spy = spyOn(router, 'navigate');
    service.login({ username: 'good-user', password: 'secret' })
      .subscribe(() => { }, error => expect(error.status).toBe(500));
    const req = httpMock.expectOne(service['backendUrl'] + '/auth/login');
    req.flush(null, { status: 500, statusText: 'Database error (JR)' });
    expect(spy).not.toHaveBeenCalled();
  }));

  it('logs out', async(() => {
    let userName;
    (<any>service)['_username'].next('user');
    service.username$.subscribe(username => userName = username);
    expect(userName).toBe('user');
    const spyNav = spyOn(router, 'navigate');
    const spyReload = spyOn((<any>service), 'reload');
    service.logout();
    const req = httpMock.expectOne(service['backendUrl'] + '/auth/logout');
    req.flush(Observable.of({ loggedOut: true }));
    expect(spyNav).toHaveBeenCalledWith(['/']);
    expect(spyReload).toHaveBeenCalled();
    expect(userName).toBe(undefined);
  }));

  it('signs up', async(() => {
    const spy = spyOn(router, 'navigate');
    service.signup({ username: 'new-user', password: 'secret' })
      .subscribe(() => { });
    const req = httpMock.expectOne(service['backendUrl'] + '/auth/signup');
    req.flush({ userName: 'new-user' });
    expect(spy).toHaveBeenCalledWith(['/']);
  }));

  it('handles signup errors', async(() => {
    const spy = spyOn(router, 'navigate');
    service.signup({ username: 'new-user', password: 'secret' })
      .subscribe(() => { }, error => expect(error.status).toBe(409));
    const req = httpMock.expectOne(service['backendUrl'] + '/auth/signup');
    req.flush(null, { status: 409, statusText: 'username-already-exists' });
    expect(spy).not.toHaveBeenCalled();
  }));

});

