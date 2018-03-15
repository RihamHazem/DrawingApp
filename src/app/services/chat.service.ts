import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { WebSocketService } from "./web-socket.service";

@Injectable()
export class ChatService {
  //
  pencilInfo: Subject<{
    type: string,
    radius: number,
    x: number,
    y: number,
    color: string
  }>;
  // isMouseDown: Subject<boolean>;
  //
  // constructor(private wsService: WebSocketService) {
  //   this.pencilInfo = <Subject<any>>wsService
  //     .connect()
  //     .map((response: any) => {
  //       return response;
  //     });
  // }
  //
  // sendPoint(msg) {
  //   this.pencilInfo.next(msg);
  // }
  //
  // endCurrentPath(msg) {
  //   this.isMouseDown.next(msg);
  // }
}
