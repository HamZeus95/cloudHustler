import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConversationComponent } from './chat-conversation.component';

describe('ChatConversationComponent', () => {
  let component: ChatConversationComponent;
  let fixture: ComponentFixture<ChatConversationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatConversationComponent]
    });
    fixture = TestBed.createComponent(ChatConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
