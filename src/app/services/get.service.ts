import { HttpClient } from "@angular/common/http";
import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";

@Injectable()
export class GetService {
  private hostName = environment.BackEnd_url;
  private signUpUrl = this.hostName + "/signUp";
  private logInUrl = this.hostName +"/logIn";
  private boardUrl = this.hostName + "/board";
  private saveBoardUrl = this.hostName + "/saveBoard";
  private deleteBoardUrl = this.hostName + "/deleteBoard";
  private isBoardExitsUrl = this.hostName + "/isBoardExists";
  private getUserSaveBoardsUrl = this.hostName + "/getUserSaveBoards";

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
  deleteRoom(boardId) {
    return this.httpClient.post(this.deleteBoardUrl, {boardId: boardId});
  }
  isBoardExists(boardId) {
    return this.httpClient.post(this.isBoardExitsUrl, {boardId: boardId});
  }
  getUserSavedBoards(userId) {
    return this.httpClient.post(this.getUserSaveBoardsUrl, {userId: userId});
  }
}
