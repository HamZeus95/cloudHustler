import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailJobsComponent } from './email-jobs.component';

describe('EmailJobsComponent', () => {
  let component: EmailJobsComponent;
  let fixture: ComponentFixture<EmailJobsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailJobsComponent]
    });
    fixture = TestBed.createComponent(EmailJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
