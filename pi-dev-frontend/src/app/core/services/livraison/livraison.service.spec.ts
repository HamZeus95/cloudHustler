import { TestBed } from '@angular/core/testing';

import { LivraisonService } from './livraison.service';

describe('LivraisonService', () => {
  let service: LivraisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivraisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
