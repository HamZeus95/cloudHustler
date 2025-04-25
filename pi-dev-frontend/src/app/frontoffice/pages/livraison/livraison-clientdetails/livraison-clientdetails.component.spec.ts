import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivraisonClientdetailsComponent } from './livraison-clientdetails.component';

describe('LivraisonClientdetailsComponent', () => {
  let component: LivraisonClientdetailsComponent;
  let fixture: ComponentFixture<LivraisonClientdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivraisonClientdetailsComponent]
    });
    fixture = TestBed.createComponent(LivraisonClientdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
