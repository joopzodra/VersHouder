import { async, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { BACKEND_URL, URL } from '../../app-tokens';
import { DbManagerService } from './db-manager.service';
import { PoemsListItem } from '../../models/list-items';

const stubListType = 'poems';
const stubQuery1 = { query: '', searchFor: 'text', maxItemsPerPage: '100' };
const requestParams1 = '?queryString=&table=poems&column=text&maxItems=100'
const stubListItems: PoemsListItem[] = [{ id: 1, text: 'text poem1' }, { id: 2, text: 'text poem2' }];

let service: DbManagerService;
let httpMock: HttpTestingController;

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

  beforeEach(inject([DbManagerService, HttpTestingController], (_service: DbManagerService, _httpMock: HttpTestingController) => {
    service = _service;
    httpMock = _httpMock;
  }));

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', inject([DbManagerService], (service: DbManagerService) => {
    expect(service).toBeTruthy();
  }));

  it('getListItems method sends a request to the backend and receives the requested listItems', async(() => {
    service.listItems$.subscribe(listItems => {
      expect(listItems).toBe(stubListItems);
    });
    service.getListItems(stubListType, stubQuery1);
    const req = httpMock.expectOne(service['backendUrl'] + '/manager/find-all' + requestParams1);
    req.flush(stubListItems);
  }));
});
