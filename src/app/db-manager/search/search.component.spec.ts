import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeUntil';
import { ReactiveFormsModule, FormGroup } from '@angular/forms'
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service';
import { SearchComponent } from './search.component';
import { HideComponentsService } from '../services/hide-components.service';
import { ListItemsStore } from '../services/list-items.store';
import { PageButtonsService } from '../services/page-buttons.service';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let el: HTMLElement;
  let de: DebugElement;
  let dbManagerService: DbManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SearchComponent],
      providers: [
      { provide: DbManagerService, useClass: MockDbManagerService },
      HideComponentsService,
      ListItemsStore,
      PageButtonsService
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
    de = fixture.debugElement;
    dbManagerService = TestBed.get(DbManagerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when the user enters values in the searchform, it passes these to the DbManagerService\'s getListItems method', () => {
    jasmine.clock().install();
    component.listType = 'poems';
    const form = component.searchForm;
    const stubSearch = { searchFor: 'poems.text', query: '', maxItemsPerPage: '100', offset: '0' };
    const spy = spyOn(dbManagerService, 'getListItems');
    form.setValue(stubSearch);
    jasmine.clock().tick(301);
    expect(spy).toHaveBeenCalledWith(component.listType, stubSearch);
    jasmine.clock().uninstall();
  });
  // Doing this test with fakeAsync works fine, but it causes an infinite stream of errors that is not visible in the terminal but only in the browser console in a Karma debug window: 
  // Uncaught Error: macroTask 'setInterval': can not transition to 'running', expecting state 'scheduled', was 'notScheduled'.
  // Therefore this test is using the jasmine.clock(). Now the test causes runs fine too, but causes only one error, also not visible in the terminal but only in the browser console in a Karma debug window: 
  // AsyncAction.js:91 Uncaught Error: executing a cancelled action at AsyncAction.webpackJsonp.../../../../rxjs/_esm5/scheduler/AsyncAction.js.AsyncAction.execute
  // By the way: the error is only thrown if you run this test on its own, with 'fit'. When running it with other test, maybe the action gets enough time to finish??

  it('when the value of the input binding \'listType\' changes (because the user navigated to another list), the form is reset', () => {
    component.listType = 'poems';
    const form = component.searchForm;
    const stubSearch = { searchFor: 'poems.text', query: 'hi', maxItemsPerPage: '10', offset: '0' };
    form.setValue(stubSearch);
    component.listType = 'bundles';
    component.ngOnChanges();
    const defaultBundlesSearch = { searchFor: 'bundles.title', query: '', maxItemsPerPage: '10', offset: '0' };
    expect(form.value).toEqual(defaultBundlesSearch);
  });

});
