import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent {
  @Input() requests: any[] = [];
  
  @Output() requestApproved = new EventEmitter<any>();
  @Output() requestRejected = new EventEmitter<any>();

  approveChatRequest(request: any): void {
    this.requestApproved.emit(request);
  }

  rejectChatRequest(request: any): void {
    this.requestRejected.emit(request);
  }
}
