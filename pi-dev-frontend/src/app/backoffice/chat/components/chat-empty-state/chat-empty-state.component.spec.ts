import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatEmptyStateComponent } from './chat-empty-state.component';

describe('ChatEmptyStateComponent', () => {
  let component: ChatEmptyStateComponent;
  let fixture: ComponentFixture<ChatEmptyStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatEmptyStateComponent]
    });
    fixture = TestBed.createComponent(ChatEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
