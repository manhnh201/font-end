import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriOrderComponent } from './peri-order.component';

describe('PeriOrderComponent', () => {
  let component: PeriOrderComponent;
  let fixture: ComponentFixture<PeriOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
