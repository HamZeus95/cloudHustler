import { TestBed } from '@angular/core/testing';

import { LivraisonPredictionServiceService } from './livraison-prediction-service.service';

describe('LivraisonPredictionServiceService', () => {
  let service: LivraisonPredictionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivraisonPredictionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
