import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSsoButtonComponent } from './login-sso-button.component';

describe('LoginSsoButtonComponent', () => {
  let component: LoginSsoButtonComponent;
  let fixture: ComponentFixture<LoginSsoButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginSsoButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSsoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
