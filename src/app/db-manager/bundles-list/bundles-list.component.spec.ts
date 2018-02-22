import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service'
import { ListItemsStore } from '../services/list-items.store'
import { BundlesListComponent } from './bundles-list.component';
import { BundlesListItem } from '../../models/list-items';
import { EditService } from '../services/edit.service';

describe('BundlesListComponent', () => {
  let component: BundlesListComponent;
  let fixture: ComponentFixture<BundlesListComponent>;
  let el: HTMLElement;
  let de: DebugElement;
  let listItemsStore: ListItemsStore;
  let editService: EditService;
  const stubListItems: BundlesListItem[] = [{ id: 1, title: 'title1' }, { id: 2, title: 'title2' }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [BundlesListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' } } } },
        { provide: DbManagerService, useClass: MockDbManagerService },
        ListItemsStore,
        EditService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
    de = fixture.debugElement;
    listItemsStore = TestBed.get(ListItemsStore);
    editService = TestBed.get(EditService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lists the bundles the ListItemsStore provides', (async () => {
    let tableRows = el.querySelectorAll('.list-item-row');
    expect(tableRows.length).toBe(0);
    (<any>listItemsStore).listItems$.next(stubListItems);
    component.listItems$.subscribe(listItems => {
      fixture.detectChanges();
      tableRows = el.querySelectorAll('.list-item-row');
      expect(tableRows.length).toBe(2);
    });
  }));

  it('when the user clicks the \'+ New Bundle\' button, the EditService\'s pushListItemId method is called with argument 0', () => {
    const spy = spyOn(editService, 'pushListItemId');
    const addButton = de.query(By.css('button'));
    addButton.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalledWith(0);
  });

  it('when the user clicks on an item in the list, the EditService\'s pushListItemId method is called with the item\'s id as argument', () => {
    const spy = spyOn(editService, 'pushListItemId');
    (<any>listItemsStore).listItems$.next(stubListItems);
    component.listItems$.subscribe(listItems => {
      fixture.detectChanges();
      let tableRow = de.query(By.css('.list-item-row'));
      tableRow.triggerEventHandler('click', null);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

});
