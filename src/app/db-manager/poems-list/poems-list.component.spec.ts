import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ListItemsStore } from '../services/list-items.store';
import { StubListItemsStore } from '../../testing/stub-list-items-store'
import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service'
import { PoemsListComponent } from './poems-list.component';
import { PoemsListItem } from '../../models/list-items';
import { EditService } from '../services/edit.service';

describe('PoemsListComponent', () => {
  let component: PoemsListComponent;
  let fixture: ComponentFixture<PoemsListComponent>;
  let el: HTMLElement;
  let de: DebugElement;
  let listItemsStore: ListItemsStore;
  let editService: EditService;
  const stubListItems: PoemsListItem[] = [{ id: 1, text: 'text poem1' }, { id: 2, text: 'text poem2' }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [PoemsListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' } } } },
        { provide: DbManagerService, useClass: MockDbManagerService },
        { provide: ListItemsStore, useClass: StubListItemsStore },
        EditService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoemsListComponent);
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

  it('lists the poems the ListItemsStore provides', (async () => {
    let tableRows = el.querySelectorAll('.list-item-row');
    expect(tableRows.length).toBe(0);
    (<any>listItemsStore).listItems$.next(stubListItems);
    component.listItems$.subscribe(listItems => {
      fixture.detectChanges();
      tableRows = el.querySelectorAll('.list-item-row');
      expect(tableRows.length).toBe(2);
    });
  }));

  it('when the user clicks on a listitem, he is navigated to the PoemItemComponent with the poem id as route param', async(() => {
    const spy = spyOn(component, 'showPoem');
    (<any>listItemsStore).listItems$.next(stubListItems);
    component.listItems$.subscribe(listItems => {
      fixture.detectChanges();
      let tableRow = de.query(By.css('.list-item-row'));
      tableRow.triggerEventHandler('click', null);
      expect(spy).toHaveBeenCalledWith(1);
    });
  }));

  it('when the user clicks the \'+ New Poem\' button, the EditService\'s pushListItemId method is called with argument 0', () => {
    const spy = spyOn(editService, 'pushListItemId');
    const addButton = de.query(By.css('button'));
    addButton.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalledWith(0);
  });

});
