import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsRequestsDashboardComponent } from './jobs-requests-dashboard.component';

describe('JobsRequestsDashboardComponent', () => {
  let component: JobsRequestsDashboardComponent;
  let fixture: ComponentFixture<JobsRequestsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobsRequestsDashboardComponent]
    });
    fixture = TestBed.createComponent(JobsRequestsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
