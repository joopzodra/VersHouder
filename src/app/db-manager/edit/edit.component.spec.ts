import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'

import { ListItemsStore } from '../services/list-items.store';
import { EditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      declarations: [EditComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' }, queryParams: {listType: 'poems', listItemId: 1} } } },
        ListItemsStore
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
