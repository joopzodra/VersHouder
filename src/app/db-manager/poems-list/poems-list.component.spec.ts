import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router'

import { ListItemsStore } from '../services/list-items.store';
import { StubListItemsStore} from '../../testing/stub-list-items-store'
import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service'
import { PoemsListComponent } from './poems-list.component';
import { PoemsListItem } from '../../models/list-items';

describe('PoemsListComponent', () => {
  let component: PoemsListComponent;
  let fixture: ComponentFixture<PoemsListComponent>;
  let el: HTMLElement;
  //let dbManagerService: DbManagerService;
  let listItemsStore: ListItemsStore;
  const stubListItems: PoemsListItem[] = [{ id: 1, text: 'text poem1' }, { id: 2, text: 'text poem2' }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoemsListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' } } } },
        { provide: DbManagerService, useClass: MockDbManagerService },
        { provide: ListItemsStore, useClass: StubListItemsStore}
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
    listItemsStore = TestBed.get(ListItemsStore);
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

});
