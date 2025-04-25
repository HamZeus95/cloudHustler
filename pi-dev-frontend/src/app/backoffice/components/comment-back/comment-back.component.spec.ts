import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentBackComponent } from './comment-back.component';

describe('CommentBackComponent', () => {
  let component: CommentBackComponent;
  let fixture: ComponentFixture<CommentBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentBackComponent]
    });
    fixture = TestBed.createComponent(CommentBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
