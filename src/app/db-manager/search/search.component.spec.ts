import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { ReactiveFormsModule, FormGroup } from '@angular/forms'
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service'

import { SearchComponent } from './search.component';

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
      providers: [{ provide: DbManagerService, useClass: MockDbManagerService },]
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

  it('if the user types values in the search field, it passes these to the DbManagerService\'s getListItems method', fakeAsync(() => {
    component.listType = 'poems';
    const form = component.searchForm;
    const stubSearch = {searchFor: 'poems', query: '', maxItemsPerPage: 100 };
    dbManagerService.listItems$.subscribe(listItems => {
      expect(listItems.length).toBe(2);
    })
    form.setValue(stubSearch);
    tick(201);
  }));

});
