import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureClientdetailsComponent } from './facture-clientdetails.component';

describe('FactureClientdetailsComponent', () => {
  let component: FactureClientdetailsComponent;
  let fixture: ComponentFixture<FactureClientdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactureClientdetailsComponent]
    });
    fixture = TestBed.createComponent(FactureClientdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
