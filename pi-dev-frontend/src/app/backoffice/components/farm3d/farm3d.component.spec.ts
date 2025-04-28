import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Farm3dComponent } from './farm3d.component';

describe('Farm3dComponent', () => {
  let component: Farm3dComponent;
  let fixture: ComponentFixture<Farm3dComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Farm3dComponent]
    });
    fixture = TestBed.createComponent(Farm3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
