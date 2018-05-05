import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {WebSocketService} from '../../services/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild("writtenMessage") writtenMessage: ElementRef;
  @ViewChild("messages") messages: ElementRef;
  @Input() userId: string;
  @Input() userName: string;
  @Input('boardId') boardId: string;
  @Input('boardName') boardName: string;

  private showForm = true;
  private notificationNum = 0;
  private showNotification = false;

  constructor(private chat: WebSocketService) { }

  ngOnInit() {
    this.chat.getChatMessage().subscribe((msg) => {
      if (msg["msg"].length > 0) {
        const li: any = document.createElement("li");
        if (msg["userId"] === this.userId) {
          li.innerHTML = msg["msg"];
          li.classList.add("me");
        } else {
          li.innerHTML = "<i class='chat-user'>" + msg["userName"] + ": </i>" + msg["msg"];
          li.classList.add("other");
          if (this.showForm === false) {
            this.notificationNum++;
            this.showNotification = true;
          }
        }
        this.messages.nativeElement.appendChild(li);
        this.messages.nativeElement.scrollTop = this.messages.nativeElement.scrollHeight;
      }
    });
  }
  onSubmit() {
    if (this.writtenMessage.nativeElement.value === 0) {
      return;
    }
    this.chat.sendChatMessage(this.writtenMessage.nativeElement.value, this.userId, this.userName);
    this.writtenMessage.nativeElement.value = '';
  }
  collapseChat() {
    this.notificationNum = 0;
    this.showNotification = false;
    this.showForm = !this.showForm;
  }

}
