import { TestBed } from '@angular/core/testing';

import { EmailJobsServiceService } from './email-jobs-service.service';

describe('EmailJobsServiceService', () => {
  let service: EmailJobsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailJobsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
