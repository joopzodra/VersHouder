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
  let router: Router;

  beforeEach(() => {
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
    router = _router;
  }));

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login method sends a request to the backend, if the response contains an authorized user it pushes the username in the username stream and navigates to the app root', async(() => {
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

  it('when login method receives an error from the backend, it does nothing (leaving it to the caller to handle the error)', async(() => {
    let userName;
    service.username$.subscribe(username => userName = username);
    expect(userName).toBe(undefined);
    const spy = spyOn(router, 'navigate');
    service.login({ username: 'good-user', password: 'secret' })
      .subscribe(() => { }, error => expect(error.status).toBe(500));
    const req = httpMock.expectOne(service['backendUrl'] + '/auth/login');
    req.flush(null, { status: 500, statusText: 'Database error (JR)' });
    expect(spy).not.toHaveBeenCalled();
    expect(userName).toBe(undefined);
  }));

  it('logout method sends a request to the backend, pushes \'undefined\' in the username stream and navigates to the login page', async(() => {
    let userName;
    (<any>service)['_username'].next('user');
    service.username$.subscribe(username => userName = username);
    expect(userName).toBe('user');
    const spyNav = spyOn(router, 'navigate');
    service.logout();
    const req = httpMock.expectOne(service['backendUrl'] + '/auth/logout');
    req.flush({ loggedOut: true });
    expect(spyNav).toHaveBeenCalledWith(['/auth/login']);
    expect(userName).toBe(undefined);
  }));

  it('logout method sends a window.alert if the backend responds with an error', async(() => {
    const spy = spyOn(window, 'alert');
    service.logout();
    const req = httpMock.expectOne(service['backendUrl'] + '/auth/logout');
    req.flush({errorMessage: 'Uh oh!'}, { status: 500, statusText: 'Database error (JR)' });
    expect(spy).toHaveBeenCalled();
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

