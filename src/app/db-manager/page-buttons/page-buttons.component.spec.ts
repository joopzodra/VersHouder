import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageButtonsComponent } from './page-buttons.component';
import { PageButtonsService } from '../services/page-buttons.service';

describe('PageButtonsComponent', () => {
  let component: PageButtonsComponent;
  let fixture: ComponentFixture<PageButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageButtonsComponent ],
      providers: [PageButtonsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
