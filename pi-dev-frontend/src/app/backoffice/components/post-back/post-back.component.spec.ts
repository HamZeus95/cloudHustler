import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBackComponent } from './post-back.component';

describe('PostBackComponent', () => {
  let component: PostBackComponent;
  let fixture: ComponentFixture<PostBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostBackComponent]
    });
    fixture = TestBed.createComponent(PostBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
