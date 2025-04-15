import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFactureComponent } from './details-facture.component';

describe('DetailsFactureComponent', () => {
  let component: DetailsFactureComponent;
  let fixture: ComponentFixture<DetailsFactureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsFactureComponent]
    });
    fixture = TestBed.createComponent(DetailsFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
