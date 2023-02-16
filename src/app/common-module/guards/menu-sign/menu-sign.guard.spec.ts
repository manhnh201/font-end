import { TestBed } from '@angular/core/testing';

import { MenuSignGuard } from './menu-sign.guard';

describe('MenuSignGuard', () => {
  let guard: MenuSignGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MenuSignGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
