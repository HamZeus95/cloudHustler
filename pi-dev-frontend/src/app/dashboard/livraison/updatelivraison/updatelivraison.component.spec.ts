import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatelivraisonComponent } from './updatelivraison.component';

describe('UpdatelivraisonComponent', () => {
  let component: UpdatelivraisonComponent;
  let fixture: ComponentFixture<UpdatelivraisonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatelivraisonComponent]
    });
    fixture = TestBed.createComponent(UpdatelivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
