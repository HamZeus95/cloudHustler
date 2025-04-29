import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipslayComponent } from './dipslay.component';

describe('DipslayComponent', () => {
  let component: DipslayComponent;
  let fixture: ComponentFixture<DipslayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DipslayComponent]
    });
    fixture = TestBed.createComponent(DipslayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
