import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontTakeQuizComponent } from './front-take-quiz.component';

describe('FrontTakeQuizComponent', () => {
  let component: FrontTakeQuizComponent;
  let fixture: ComponentFixture<FrontTakeQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrontTakeQuizComponent]
    });
    fixture = TestBed.createComponent(FrontTakeQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
