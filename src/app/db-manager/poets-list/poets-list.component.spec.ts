import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router'
import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service'

import { PoetsListComponent } from './poets-list.component';

describe('PoetsListComponent', () => {
  let component: PoetsListComponent;
  let fixture: ComponentFixture<PoetsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoetsListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' } } } },
        { provide: DbManagerService, useClass: MockDbManagerService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
