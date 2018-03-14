import { async, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { BACKEND_URL, URL } from '../../app-tokens';
import { DbManagerService } from './db-manager.service';
import { ListItemsStore } from '../services/list-items.store';
import { PoemsListItem } from '../../models/list-items';
import { Poet } from '../../models/foreign-key-children';

const stubListType = 'poems';
const stubQuery = { query: '', searchFor: 'text', maxItemsPerPage: '100', offset: '0' };
const stubRequestParams = '?queryString=&table=poems&column=text&maxItems=100&offset=0'
const stubListItems: PoemsListItem[] = [{ id: 1, text: 'text poem1' }, { id: 2, text: 'text poem2' }];
const stubForeignKeyType = 'poets';
const stubPoet = { name: 'poet' };


let service: DbManagerService;
let httpMock: HttpTestingController;
let listItemsStore: any;

describe('DbManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        DbManagerService,
        ListItemsStore,
        { provide: BACKEND_URL, useValue: URL }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(DbManagerService);
    httpMock = TestBed.get(HttpTestingController);
    listItemsStore = TestBed.get(ListItemsStore);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', inject([DbManagerService], (service: DbManagerService) => {
    expect(service).toBeTruthy();
  }));

  it('getListItems method sends a request to the backend, receives the requested ListItems and calls ListItemStore\'s dispatch method with these ListItems', async(() => {
    service.getListItems(stubListType, stubQuery);
    const req = httpMock.expectOne(service['backendUrl'] + '/manager/find-all' + stubRequestParams);
    req.flush(stubListItems);
    listItemsStore.listItems$.subscribe((listItems: any) => {
      expect(listItems).toEqual(stubListItems);
    });
  }));

  it('getListItems method handles backend errors, they result in pushing the error status by the remoteError$ property', async(() => {
    service.getListItems(stubListType, stubQuery);
    const req = httpMock.expectOne(service['backendUrl'] + '/manager/find-all' + stubRequestParams);
    req.flush('errormessage', { status: 500, statusText: 'Database error' });
    service.remoteError$.subscribe(errorStatus => {
      expect(errorStatus).toBe(500);
    });
  }));

  it('createOrUpdateListItem method, called with a new ListItem, sends a request to the backend, receives the new ListItem and calls ListItemStore\'s dispatch method with this ListItem', () => {
    const spy = spyOn(listItemsStore, 'dispatch');
    service.createOrUpdateListItem(stubListType, { id: 0, text: 'a new poem' })
      .subscribe(res => {
        expect(res).toBe(true);
        expect(spy).toHaveBeenCalledWith({ type: 'ADD', data: [{ id: 112, text: 'a new poem' }] });
      });
    const requestParams1 = '?table=' + stubListType;
    const req1 = httpMock.expectOne(service['backendUrl'] + '/manager/create' + requestParams1);
    req1.flush({id: 10}); // backend response with a stub id
    const requestParams2 = '?table=' + stubListType + '&itemId=10';
    const req2 = httpMock.expectOne(service['backendUrl'] + '/manager/find-by-id' + requestParams2);
    req2.flush({ id: 112, text: 'a new poem' });
  });

  it('createOrUpdateListItem method, called with an updated existing ListItem, sends a request to the backend, receives a response, returns true to its subscribers and calls ListItemStore\'s dispatch method with the ListItem', () => {
    const spy = spyOn(listItemsStore, 'dispatch');
    service.createOrUpdateListItem(stubListType, { id: 1, text: 'an updated poem' })
      .subscribe(res => {
        expect(res).toBe(true);
        expect(spy).toHaveBeenCalledWith({ type: 'EDIT', data: [{ id: 1, text: 'an updated poem' }] });
      });
    const requestParams = '?table=' + stubListType;
    const req = httpMock.expectOne(service['backendUrl'] + '/manager/update' + requestParams);
    req.flush([1]);
  });

  it('deleteListItem method sends a request to the backend, receives a response, sends true to its subscribers and calls ListItemStore\'s dispatch method with the ListItem', () => {
    const spy = spyOn(listItemsStore, 'dispatch');
    service.deleteListItem(stubListType, { id: 1, text: 'a poem' })
      .subscribe(res => {
        expect(res).toBe(true);
        expect(spy).toHaveBeenCalledWith({ type: 'REMOVE', data: [{ id: 1, text: 'a poem' }] });
      });
    const requestParams = '?table=' + stubListType + '&id=1';
    const req = httpMock.expectOne(service['backendUrl'] + '/manager/delete' + requestParams);
    req.flush([0]);
  });

  it('queryChildren method sends a request to the backend, receives an array of poets or bundles which it sends to its subscribers', () => {
    service.queryChildren(stubForeignKeyType, 'pe')
      .subscribe(res => {
        expect(res).toEqual(<Poet[]>[stubPoet]);
      });
    const requestParams = '?queryString=pe&table=poets';
    const req = httpMock.expectOne(service['backendUrl'] + '/manager/find-children' + requestParams);
    req.flush([stubPoet]);
  });

  it('findChildById method sends a request to the backend, receives a poet or bundle which it sends to its subscribers', () => {
    service.findChildById(stubForeignKeyType, 1)
      .subscribe(res => {
        expect(res).toEqual(<Poet>stubPoet);
      });
    const requestParams = '?id=1&table=poets';
    const req = httpMock.expectOne(service['backendUrl'] + '/manager/find-child-by-id' + requestParams);
    req.flush(stubPoet);
  });
});
