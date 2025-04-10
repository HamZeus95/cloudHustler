import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuivilivraisonsComponent } from './suivilivraisons.component';

describe('SuivilivraisonsComponent', () => {
  let component: SuivilivraisonsComponent;
  let fixture: ComponentFixture<SuivilivraisonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuivilivraisonsComponent]
    });
    fixture = TestBed.createComponent(SuivilivraisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
