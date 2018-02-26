import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControlName } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { Component, DebugElement, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ListItemsStore, LOAD } from '../services/list-items.store';
import { EditComponent } from './edit.component';
import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service'
import { EditService } from '../services/edit.service';
import { ListItem } from '../../models/list-items';

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
  let editService: EditService;
  let listItemsStore: ListItemsStore;
  const stubListItems: ListItem[] = [{ id: 1, title: 'title poem1', text: 'text poem1' }, { id: 2, title: 'title poem2', text: 'text poem2' }];

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
    editService = TestBed.get(EditService);
    listItemsStore = TestBed.get(ListItemsStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent.editComponent).toBeTruthy();
  });

  it('which form it displays is determined by the listType input binding ', () => {
    const editComponent = hostComponent.editComponent;
    hostComponent.listType = 'poems';
    editComponent.listItem = { id: 1, text: 'poem1' }; // If listItem is undefinded, the form is not displayed.
    fixture.detectChanges();
    expect(editComponent._listType).toBe('poems');
    let firstInput = de.query(By.css('input'))
    expect(firstInput.attributes.formControlName).toBe('title')
    hostComponent.listType = 'poets';
    editComponent.listItem = { id: 1, name: 'poet1' };
    fixture.detectChanges();
    expect(editComponent._listType).toBe('poets');
    firstInput = de.query(By.css('input'));
    expect(firstInput.attributes.formControlName).toBe('name');
  });

  it('displays empty formfields if the listitem id it receives from the EditService is 0', async(() => {
    const editComponent = hostComponent.editComponent;
    hostComponent.listType = 'poems';
    fixture.detectChanges();
    listItemsStore.dispatch({ type: LOAD, data: stubListItems });
    editService.listItemId$.subscribe(() => {
      fixture.detectChanges();
      const firstInput = el.querySelector('input');
      const textarea = el.querySelector('textarea');
      expect(firstInput.value).toBe('');
      expect(textarea.value).toBe('');
    })
    editService.pushListItemId(0);
  }));

  it('prefills the form with the listitem\'s data if it receives a listitem id from the EditService', async(() => {
    const editComponent = hostComponent.editComponent;
    hostComponent.listType = 'poems';
    fixture.detectChanges();
    listItemsStore.dispatch({ type: LOAD, data: stubListItems });
    editService.listItemId$.subscribe(() => {
      fixture.detectChanges();
      const firstInput = el.querySelector('input');
      const textarea = el.querySelector('textarea');
      expect(firstInput.value).toBe('title poem2');
      expect(textarea.value).toBe('text poem2')
    });
    editService.pushListItemId(2);
  }));

});
