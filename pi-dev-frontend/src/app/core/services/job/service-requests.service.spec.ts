import { TestBed } from '@angular/core/testing';

import { ServiceRequestsService } from './service-requests.service';

describe('ServiceRequestsService', () => {
  let service: ServiceRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
