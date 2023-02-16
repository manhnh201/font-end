import { TestBed } from '@angular/core/testing';

import { SignParamsInterceptor } from './sign-params.interceptor';

describe('SignParamsInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SignParamsInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SignParamsInterceptor = TestBed.inject(SignParamsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
