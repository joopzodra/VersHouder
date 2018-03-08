import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'

import { Alert401Component } from './alert-401.component';

describe('Alert401Component', () => {
  let component: Alert401Component;
  let fixture: ComponentFixture<Alert401Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [Alert401Component]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Alert401Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
