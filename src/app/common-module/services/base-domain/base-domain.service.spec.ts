import { TestBed } from '@angular/core/testing';

import { BaseDomainService } from './base-domain.service';

describe('BaseDomainService', () => {
  let service: BaseDomainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseDomainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
