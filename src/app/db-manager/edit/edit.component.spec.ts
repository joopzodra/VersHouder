import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControlName } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { Component, DebugElement, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ListItemsStore } from '../services/list-items.store';
import { EditComponent } from './edit.component';
import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service'
import { EditService } from '../services/edit.service';

@Component({
  template: '<jr-edit [listType]="listType"></jr-edit>'
})
class TestHostComponent {
  listType: string;
  @ViewChild(EditComponent) editComponent: EditComponent;
}

describe('EditComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let el: HTMLElement;
  let de: DebugElement;
  let dbManagerService: DbManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      declarations: [EditComponent, TestHostComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' } } } },
        { provide: DbManagerService, useClass: MockDbManagerService },
        ListItemsStore,
        EditService
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    el = fixture.nativeElement;
    de = fixture.debugElement;
    dbManagerService = TestBed.get(DbManagerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent.editComponent).toBeTruthy();
  });

  it('which form it displays is determined by the listType input binding ', () => {
    const editComponent = hostComponent.editComponent;
    hostComponent.listType = 'poems';
    editComponent.listItem = {id: 1, text: 'poem1'}; // If listItem is undefinded, the form is not displayed.
    fixture.detectChanges();
    expect(editComponent._listType).toBe('poems');
    let firstInput = de.query(By.css('input'))
    expect(firstInput.attributes.formControlName).toBe('title')
    hostComponent.listType = 'poets';
    editComponent.listItem = {id: 1, name: 'poet1'};
    fixture.detectChanges();
    expect(editComponent._listType).toBe('poets');
    firstInput = de.query(By.css('input'));
    expect(firstInput.attributes.formControlName).toBe('name');
  });

  it('STILL MORE SPECS TO DO !!!!!!!!!!!!!!!!!!!!!!!', () => {

  });

});
