import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router'

import { PoemsListComponent } from './poems-list.component';

describe('PoemsListComponent', () => {
  let component: PoemsListComponent;
  let fixture: ComponentFixture<PoemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoemsListComponent ],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' } } } }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
