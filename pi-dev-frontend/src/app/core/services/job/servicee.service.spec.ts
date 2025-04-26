import { TestBed } from '@angular/core/testing';

import { ServiceeService } from './servicee.service';

describe('ServiceeService', () => {
  let service: ServiceeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
