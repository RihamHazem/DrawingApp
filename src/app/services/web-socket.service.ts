import { Injectable } from "@angular/core";
import 'rxjs/add/operator/map';
import { Socket } from "ng-socket-io";

@Injectable()
export class WebSocketService {

  constructor(private socket: Socket) {
    socket.connect();
  }

  getPoint() {
    return this.socket
      .fromEvent<any>("point");
  }

  getMouseState() {
    return this.socket
      .fromEvent("mouseState");
  }

  getChangeRadius() {
    return this.socket
      .fromEvent("changeRadius");
  }

  getChatMessage() {
    return this.socket
      .fromEvent("chatMessage");
  }
  getUndo() {
    return this.socket
      .fromEvent("undo");
  }
  getText() {
    return this.socket
      .fromEvent("text");
  }
  getTextVal() {
    return this.socket
      .fromEvent("textVal");
  }
  getGame() {
    return this.socket
      .fromEvent("game");
  }
///////////////////////////////////////////////////////////////////////
  sendPoint(point: { radius: number, x: number, y: number, color: string }, type, userId: string, userName: string) {
    this.socket
      .emit("point", {point: point, type: type, userId: userId, userName: userName});
  }

  sendMouseState(userId: string) {
    this.socket.emit("mouseState", userId);
  }
  setChangeRadius(callSetRadius: {type: string, radius: number}, userId) {
    this.socket
      .emit("changeRadius", {radius: callSetRadius, userId: userId});
  }
  addUser(userId: string, room: string) {
    this.socket
      .emit("addUser", {room: room, id: userId});
  }
  sendChatMessage(msg: string, userId: string, userName: string) {
    this.socket
      .emit("chatMessage", {msg: msg, userId: userId, userName: userName});
  }
  sendUndo(userId) {
    this.socket
      .emit("undo", userId);
  }
  sendText(text, userId) {
    this.socket
      .emit("text", {text: text, userId: userId});
  }
  sendTextVal(textId, val, userId) {
    this.socket
      .emit("textVal", {id: textId, val: val, userId: userId});
  }
  sendGame(userName, i, j) {
    this.socket
      .emit("game", {userName: userName, i: i, j: j});
  }
}
