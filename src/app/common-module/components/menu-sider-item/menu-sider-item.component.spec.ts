import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSiderItemComponent } from './menu-sider-item.component';

describe('MenuSiderItemComponent', () => {
  let component: MenuSiderItemComponent;
  let fixture: ComponentFixture<MenuSiderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuSiderItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSiderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
