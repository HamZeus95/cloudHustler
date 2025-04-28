import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsFormComponent } from './jobs-form.component';

describe('JobsFormComponent', () => {
  let component: JobsFormComponent;
  let fixture: ComponentFixture<JobsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobsFormComponent]
    });
    fixture = TestBed.createComponent(JobsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
