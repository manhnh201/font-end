import { TestBed } from '@angular/core/testing';

import { PeriOrderService } from './peri-order.service';

describe('PeriOrderService', () => {
  let service: PeriOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
