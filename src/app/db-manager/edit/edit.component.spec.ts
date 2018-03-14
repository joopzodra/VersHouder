import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControlName } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { Component, DebugElement, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { first } from 'rxjs/operators';

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
  let editComponent: EditComponent;
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
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    editComponent = hostComponent.editComponent;
    el = fixture.nativeElement;
    de = fixture.debugElement;
    dbManagerService = TestBed.get(DbManagerService);
    editService = TestBed.get(EditService);
    listItemsStore = TestBed.get(ListItemsStore);
    fixture.detectChanges();
  });

  beforeEach(() => {
    listItemsStore.dispatch({ type: LOAD, data: stubListItems });
  });

  it('should create', () => {
    expect(hostComponent.editComponent).toBeTruthy();
  });

  it('which form it displays is determined by the listType input binding ', () => {
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
    hostComponent.listType = 'poems';
    fixture.detectChanges();
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
    hostComponent.listType = 'poems';
    fixture.detectChanges();
    editService.listItemId$.subscribe(() => {
      fixture.detectChanges();
      const firstInput = el.querySelector('input');
      const textarea = el.querySelector('textarea');
      expect(firstInput.value).toBe('title poem2');
      expect(textarea.value).toBe('text poem2')
    });
    editService.pushListItemId(2);
  }));

  it('onSubmit method calls dbManagerService\'s createOrUpdateListItem method and after a succesfull backend response it emits -1 to the EditService, which causes the form to disappear', async(() => {
    hostComponent.listType = 'poems';
    fixture.detectChanges();
    const spy = spyOn(dbManagerService, 'createOrUpdateListItem').and.callThrough();
    editService.listItemId$
      .pipe(first()) // In the test the editService pushes twice, but the second time the editComponent.listItem is undefined, causing an error
      .subscribe(() => {
        fixture.detectChanges();
        expect(el.querySelector('form')).toBeTruthy();
        editComponent.editForm.patchValue({ text: 'edited text' });
        editComponent.onSubmit(editComponent.editForm.value);
        const editedItem = { id: 2, title: 'title poem2', text: 'edited text', poet_id: '', poet_name: '', bundle_id: '', bundle_title: '', url: '', url_label: '', comment: '' };
        expect(spy).toHaveBeenCalledWith(hostComponent.listType, editedItem);
      });
    editService.pushListItemId(2);
  }));

  it('deleteListItem method calls dbManagerService\'s deleteListItem method and after a succesfull backend response it emits -1 to the EditService, which causes the form to disappear', async(() => {
    hostComponent.listType = 'poems';
    fixture.detectChanges();
    const spy = spyOn(dbManagerService, 'deleteListItem').and.callThrough();
    editService.listItemId$
      .subscribe(res => {
        console.log("mijnres: ", res)
        fixture.detectChanges();
        expect(el.querySelector('form')).toBeTruthy();
        editComponent.deleteListItem();
        expect(spy).toHaveBeenCalledWith(hostComponent.listType, stubListItems[1]);
      });
    editService.pushListItemId(2);
  }));

  it('emitting -1 to the EditService indeed causes the form to disappear', async(() => {
    hostComponent.listType = 'poems';
    fixture.detectChanges();
    editService.listItemId$
      .subscribe(listItemId => {
        fixture.detectChanges();
        if (listItemId !== -1) {
          expect(el.querySelector('form')).toBeTruthy();
        } else {
          expect(el.querySelector('form')).toBeFalsy();
        }
      });
    editService.pushListItemId(2);
    editService.pushListItemId(-1);
  }));

  it('onForeignKeyChange adjusts the formvalues to the foreign key it gets passed', async(() => {
    editComponent.listType = 'poems';
    const form = editComponent.editForm;
    const initialFormValue = { text: 'text poem1', title: 'title poem1', poet_id: '', poet_name: '', bundle_id: '', bundle_title: '', url: '', url_label: '', comment: '' };
    const poet = { id: 2, name: 'poet2' };
    editService.listItemId$
      .subscribe(res => {
        expect(form.value).toEqual(initialFormValue);
        editComponent.onForeignKeyChange(poet);
        const newFormValue = { text: 'text poem1', title: 'title poem1', poet_id: 2, poet_name: 'poet2', bundle_id: '', bundle_title: '', url: '', url_label: '', comment: '' };
        expect(form.value).toEqual(newFormValue);
      });
    editService.pushListItemId(1);
  }));
});
