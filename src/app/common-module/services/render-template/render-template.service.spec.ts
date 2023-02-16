import { TestBed } from '@angular/core/testing';

import { RenderTemplateService } from './render-template.service';

describe('RenderTemplateService', () => {
  let service: RenderTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenderTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
