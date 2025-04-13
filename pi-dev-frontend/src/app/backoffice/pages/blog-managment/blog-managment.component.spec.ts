import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogManagmentComponent } from './blog-managment.component';

describe('BlogManagmentComponent', () => {
  let component: BlogManagmentComponent;
  let fixture: ComponentFixture<BlogManagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogManagmentComponent]
    });
    fixture = TestBed.createComponent(BlogManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
