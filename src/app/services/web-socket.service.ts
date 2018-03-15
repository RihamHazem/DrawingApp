import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { environment } from "../../environments/environment";
import 'rxjs/add/operator/map';
import { Socket } from "ng-socket-io";

@Injectable()
export class WebSocketService {

  constructor(private socket: Socket) { }
  getMessage() {
    return this.socket
      .fromEvent<any>("message");
  }

  getMouseState() {
    return this.socket
      .fromEvent("mouseState");
  }

  sendMessage(msg: { type: string, radius: number, x: number, y: number, color: string }) {
    this.socket
      .emit("message", msg);
  }

  sendMouseState(isDown: boolean) {
    this.socket.emit("mouseState", isDown);
  }
}
