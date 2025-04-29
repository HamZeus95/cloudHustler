import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRequestsComponent } from './job-requests.component';

describe('JobRequestsComponent', () => {
  let component: JobRequestsComponent;
  let fixture: ComponentFixture<JobRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobRequestsComponent]
    });
    fixture = TestBed.createComponent(JobRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
