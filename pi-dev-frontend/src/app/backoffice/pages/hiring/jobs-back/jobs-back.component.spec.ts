import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsBackComponent } from './jobs-back.component';

describe('JobsBackComponent', () => {
  let component: JobsBackComponent;
  let fixture: ComponentFixture<JobsBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobsBackComponent]
    });
    fixture = TestBed.createComponent(JobsBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
