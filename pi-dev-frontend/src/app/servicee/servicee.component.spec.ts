import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceeComponent } from './servicee.component';

describe('ServiceeComponent', () => {
  let component: ServiceeComponent;
  let fixture: ComponentFixture<ServiceeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceeComponent]
    });
    fixture = TestBed.createComponent(ServiceeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
