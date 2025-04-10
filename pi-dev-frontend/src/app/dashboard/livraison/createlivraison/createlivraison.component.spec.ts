import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatelivraisonComponent } from './createlivraison.component';

describe('CreatelivraisonComponent', () => {
  let component: CreatelivraisonComponent;
  let fixture: ComponentFixture<CreatelivraisonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatelivraisonComponent]
    });
    fixture = TestBed.createComponent(CreatelivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
