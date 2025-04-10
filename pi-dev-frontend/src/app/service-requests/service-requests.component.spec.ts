import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestsComponent } from './service-requests.component';

describe('ServiceRequestsComponent', () => {
  let component: ServiceRequestsComponent;
  let fixture: ComponentFixture<ServiceRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceRequestsComponent]
    });
    fixture = TestBed.createComponent(ServiceRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
