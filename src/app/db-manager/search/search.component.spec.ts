import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { FormsModule, FormGroup } from '@angular/forms'
import { DbManagerService } from '../services/db-manager.service';
import { MockDbManagerService } from '../../testing/mock-db-manager-service'

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ SearchComponent ],
      providers: [{ provide: DbManagerService, useClass: MockDbManagerService },]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
