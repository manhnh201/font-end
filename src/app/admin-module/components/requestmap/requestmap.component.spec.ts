import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestmapComponent } from './requestmap.component';

describe('RequestmapComponent', () => {
  let component: RequestmapComponent;
  let fixture: ComponentFixture<RequestmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
