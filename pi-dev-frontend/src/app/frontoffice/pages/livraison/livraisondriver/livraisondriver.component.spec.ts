import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivraisondriverComponent } from './livraisondriver.component';

describe('LivraisondriverComponent', () => {
  let component: LivraisondriverComponent;
  let fixture: ComponentFixture<LivraisondriverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivraisondriverComponent]
    });
    fixture = TestBed.createComponent(LivraisondriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
