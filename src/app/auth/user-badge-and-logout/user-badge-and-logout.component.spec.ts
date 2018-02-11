import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '../services/auth.service';
import { MockAuthService } from '../../testing/mock-auth-service';
import { UserBadgeAndLogoutComponent } from './user-badge-and-logout.component';

describe('UserBadgeAndLogoutComponent', () => {
  let component: UserBadgeAndLogoutComponent;
  let fixture: ComponentFixture<UserBadgeAndLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBadgeAndLogoutComponent ],
      providers: [{ provide: AuthService, useClass: MockAuthService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBadgeAndLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
