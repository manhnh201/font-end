import { TestBed } from '@angular/core/testing';

import { RequestmapService } from './requestmap.service';

describe('RequestmapService', () => {
  let service: RequestmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestmapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
