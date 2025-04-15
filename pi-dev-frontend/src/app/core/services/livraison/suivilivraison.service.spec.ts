import { TestBed } from '@angular/core/testing';

import { SuiviLivraisonService } from './suivilivraison.service';

describe('SuivilivraisonService', () => {
  let service: SuiviLivraisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuiviLivraisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
