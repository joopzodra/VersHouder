import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { Component, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { PoemItemComponent } from './poem-item.component';
import { PoemsListComponent } from '../poems-list/poems-list.component';
import { ListItemsStore } from '../services/list-items.store';
import { StubListItemsStore } from '../../testing/stub-list-items-store'
import { EditService } from '../services/edit.service';
import { PoemsListItem } from '../../models/list-items';

describe('PoemItemComponent', () => {
  let component: PoemItemComponent;
  let fixture: ComponentFixture<PoemItemComponent>;
  let el: HTMLElement;
  let de: DebugElement;
  let listItemsStore: ListItemsStore;
  let editService: EditService;
  const stubListItems: PoemsListItem[] = [{ id: 1, text: 'text poem1' }, { id: 2, text: 'text poem2' }];

  @Component({
    template: ''
  })
  class StubComponent {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{path:'db-manager/poems', component:StubComponent}])],
      declarations: [PoemItemComponent, StubComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'Test title' }, params: { listType: 'poems', id: 1 } } } },
        { provide: ListItemsStore, useClass: StubListItemsStore },
        EditService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoemItemComponent);
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

  it('from the poems the ListItemsStore provides, it displays the poem with the id it gets in the route params', (async () => {    
    (<any>listItemsStore).listItems$.next(stubListItems);
    component.poemItem$.subscribe(poemItem => {
      fixture.detectChanges();
      let tableRow = el.querySelector('.poem-text');
      expect(tableRow.textContent).toBe('text poem1');
    });
  }));

  it('when the user clicks the edit button, the EditService\'s pushListItemId method is called with the poem\'s id as argument', async(() => {
    const spy = spyOn(editService, 'pushListItemId');
    (<any>listItemsStore).listItems$.next(stubListItems);
    component.poemItem$.subscribe(poemItem => {
      fixture.detectChanges();
      let editButton = de.query(By.css('button'));
      editButton.triggerEventHandler('click', null);
      expect(spy).toHaveBeenCalledWith(1);
    });
  }));

});
