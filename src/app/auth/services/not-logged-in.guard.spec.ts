import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { NotLoggedInGuard } from './not-logged-in.guard';
import { AuthService } from '../services/auth.service';
import { MockAuthService } from '../../testing/mock-auth-service';
import { StubRouter } from '../../testing/stub-router';

describe('NotLoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotLoggedInGuard,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: StubRouter }
      ]
    });
  });

  it('should ...', inject([NotLoggedInGuard], (guard: NotLoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});
