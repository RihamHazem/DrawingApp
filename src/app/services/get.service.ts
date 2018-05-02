import { HttpClient } from "@angular/common/http";
import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";

@Injectable()
export class GetService {
  private hostName = "192.168.43.219";
  private signUpUrl = "http://" + this.hostName + ":3000/signUp";
  private logInUrl = "http://" + this.hostName +":3000/logIn";
  private boardUrl = "http://" + this.hostName + ":3000/board";
  private saveBoardUrl = "http://" + this.hostName + ":3000/saveBoard";
  private getUserSaveBoardsUrl = "http://" + this.hostName + ":3000/getUserSaveBoards";
  constructor(private httpClient: HttpClient) { }

  createNewUser(user: {name: string, email: string, password: string, photo: string, type: string}): Observable<any> {
    return this.httpClient.post(this.signUpUrl, user);
  }
  logInUser(user: {email: string, password}): Observable<any> {
    return this.httpClient.post(this.logInUrl, user);
  }

  createNewRoom(userId, boardName) {
    return this.httpClient.post(this.boardUrl, {userId: userId, boardName: boardName});
  }

  saveNewRoom(boardId, imagePath) {
    return this.httpClient.patch(this.saveBoardUrl, {boardId: boardId, image: imagePath});
  }

  getUserSavedBoards(userId) {
    return this.httpClient.post(this.getUserSaveBoardsUrl, {userId: userId});
  }
}
