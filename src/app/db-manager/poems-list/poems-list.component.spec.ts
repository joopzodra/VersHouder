import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router'


import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service'
import { PoemsListComponent } from './poems-list.component';
import { PoemsListItem } from '../../models/list-items';

describe('PoemsListComponent', () => {
  let component: PoemsListComponent;
  let fixture: ComponentFixture<PoemsListComponent>;
  let el: HTMLElement;
  let dbManagerService: DbManagerService;
  const stubListItems: PoemsListItem[] = [{ id: 1, text: 'text poem1' }, { id: 2, text: 'text poem2' }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoemsListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' } } } },
        { provide: DbManagerService, useClass: MockDbManagerService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
    dbManagerService = TestBed.get(DbManagerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lists the poems the DbManagerService provides', (async () => {
    let tableRows = el.querySelectorAll('.list-item-row');
    expect(tableRows.length).toBe(0);
    component.listItems$.subscribe(listItems => {
      fixture.detectChanges();
      tableRows = el.querySelectorAll('.list-item-row');
      expect(tableRows.length).toBe(2);
    });
    (<any>dbManagerService).listItems$.next(stubListItems);
  }));

});
