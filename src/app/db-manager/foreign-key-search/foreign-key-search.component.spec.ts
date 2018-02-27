import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControlName } from '@angular/forms'
import { Component, DebugElement, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { ForeignKeySearchComponent } from './foreign-key-search.component';
import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service';
import { Poet, Bundle } from '../../models/foreign-key-children';
import { BACKEND_URL, URL } from '../../app-tokens';

@Component({
  template: `
    <jr-foreign-key-search [foreignKeyType]="'poets'" [foreignKey]="12" (onForeignKeyChange)="onForeignKeyChange($event)"></jr-foreign-key-search>
  `
})
class TestHostComponent {
  @ViewChild(ForeignKeySearchComponent) foreignKeySearchComponent: ForeignKeySearchComponent;
  onForeignKeyChange(event: any) { }
}

describe('ForeignKeySearchComponent', () => {
  let hostcomponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let el: HTMLElement;
  let de: DebugElement;
  let dbManagerService: DbManagerService;
  let foreignKeySearchComponent: ForeignKeySearchComponent

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule],
      declarations: [ForeignKeySearchComponent, TestHostComponent],
      providers: [
      { provide: DbManagerService, useClass: MockDbManagerService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostcomponent = fixture.componentInstance;
    el = fixture.nativeElement;
    de = fixture.debugElement;
    dbManagerService = TestBed.get(DbManagerService);
    foreignKeySearchComponent = hostcomponent.foreignKeySearchComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostcomponent.foreignKeySearchComponent).toBeTruthy();
  });

  it('it uses the foreignKey it receives from the host component to display the child by the DbManagerService\'s findChildById method', async(() => {
    const selectedChild = foreignKeySearchComponent.selectedChild;
    expect(selectedChild).toEqual({ id: 12, name: 'poet12' });
  }));

  it('when the user types a query in the form\'s input field, the corresponding children are retreived by the DbManagerService\'s queryChildren method and displayed in a list', async(() => {
    foreignKeySearchComponent.removeSelectedChild();
    fixture.detectChanges();
    let suggestedItems = el.querySelectorAll('.suggested-children');
    expect(suggestedItems.length).toBe(0);
    foreignKeySearchComponent.suggestedChildren$.subscribe(children => {
      fixture.detectChanges();
      suggestedItems = el.querySelectorAll('.suggested-children');
      expect(suggestedItems.length).toBe(2);
      expect(suggestedItems[0].textContent).toBe('poet13');
    })
    foreignKeySearchComponent.searchChildForm.setValue({ query: 'poet' });
  }));

  it('when the user clicks on an item in the suggested-children-list, that item is displayed and an onForeignKeyChange event is emitted to the host component', async(() => {
    foreignKeySearchComponent.removeSelectedChild();
    fixture.detectChanges();
    const spy = spyOn(hostcomponent, 'onForeignKeyChange');
    foreignKeySearchComponent.suggestedChildren$.subscribe(children => {
      fixture.detectChanges();
      const secondSuggestedChild = de.queryAll(By.css('.suggested-children'))[1];
      if (!secondSuggestedChild) {
        return; // Because after the triggerEventHandler below, the form will be reset and the suggested-children-list then is empty.
      }
      secondSuggestedChild.triggerEventHandler('click', null);
      fixture.detectChanges();
      const selectedChild = el.querySelector('.selected-child');
      expect(selectedChild.textContent).toContain('poet 14');
      expect(spy).toHaveBeenCalledWith({id: 14, name: 'poet 14'});
    })
    foreignKeySearchComponent.searchChildForm.setValue({ query: 'poet' });
  }));

});
