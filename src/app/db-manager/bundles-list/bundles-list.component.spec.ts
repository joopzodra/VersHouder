import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router'
import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service'
import {ListItemsStore} from '../services/list-items.store'

import { BundlesListComponent } from './bundles-list.component';

describe('BundlesListComponent', () => {
  let component: BundlesListComponent;
  let fixture: ComponentFixture<BundlesListComponent>;
  let listItemStore: ListItemsStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BundlesListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' } } } },
        { provide: DbManagerService, useClass: MockDbManagerService },
        ListItemsStore
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //listItemsStore???
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
