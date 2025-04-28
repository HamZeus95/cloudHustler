import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerPostComponent } from './gener-post.component';

describe('GenerPostComponent', () => {
  let component: GenerPostComponent;
  let fixture: ComponentFixture<GenerPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerPostComponent]
    });
    fixture = TestBed.createComponent(GenerPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
