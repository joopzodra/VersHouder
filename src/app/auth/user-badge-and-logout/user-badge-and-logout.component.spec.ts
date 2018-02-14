import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { AuthService } from '../services/auth.service';
import { MockAuthService } from '../../testing/mock-auth-service';
import { UserBadgeAndLogoutComponent } from './user-badge-and-logout.component';

describe('UserBadgeAndLogoutComponent', () => {
  let component: UserBadgeAndLogoutComponent;
  let fixture: ComponentFixture<UserBadgeAndLogoutComponent>;
  let el: HTMLElement;
  let de: DebugElement;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBadgeAndLogoutComponent ],
      providers: [{ provide: AuthService, useClass: MockAuthService }]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBadgeAndLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
    de = fixture.debugElement;
    authService = TestBed.get(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the username if a user is logged in', () => {
    let usernameDiv = el.querySelector('.text-container');
    expect(usernameDiv).toBeFalsy();
    (<any>authService).username$.next('good-user');
    fixture.detectChanges();
    usernameDiv = el.querySelector('.text-container');
    expect(usernameDiv.textContent).toContain('good-user');
  });

  it('if a user is logged in, it contains a logout button; when this is clicked it calls the AuthService logout method', () => {
    const spy = spyOn(authService, 'logout');
    let logoutButton = de.query(By.css('.w3-bar-item.w3-button'));
    expect(logoutButton).toBeFalsy();
    (<any>authService).username$.next('good-user');
    fixture.detectChanges();
    logoutButton = de.query(By.css('.w3-bar-item.w3-button'));
    logoutButton.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });
});
