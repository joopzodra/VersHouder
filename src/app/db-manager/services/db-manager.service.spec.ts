import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL, URL } from '../../app-tokens';

import { DbManagerService } from './db-manager.service';

describe('DbManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
      DbManagerService,
      { provide: BACKEND_URL, useValue: URL }
      ]
    });
  });

  it('should be created', inject([DbManagerService], (service: DbManagerService) => {
    expect(service).toBeTruthy();
  }));
});
