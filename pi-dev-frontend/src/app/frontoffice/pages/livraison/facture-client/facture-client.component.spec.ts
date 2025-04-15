import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureClientComponent } from './facture-client.component';

describe('FactureClientComponent', () => {
  let component: FactureClientComponent;
  let fixture: ComponentFixture<FactureClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactureClientComponent]
    });
    fixture = TestBed.createComponent(FactureClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
