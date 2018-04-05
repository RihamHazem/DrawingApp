import { HttpClient } from "@angular/common/http";
import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";

@Injectable()
export class GetService {
  private signUpUrl = "http://127.0.0.1:3000/signUp";
  private logInUrl = "http://127.0.0.1:3000/logIn";
  private createBoardUrl = "http://127.0.0.1:3000/board";
  constructor(private httpClient: HttpClient) { }

  createNewUser(user: {name: string, email: string, password: string, type: string}): Observable<any> {
    return this.httpClient.post(this.signUpUrl, user);
  }
  logInUser(user: {email: string, password}): Observable<any> {
    return this.httpClient.post(this.logInUrl, user);
  }

  createNewRoom(userId) {
    console.log(userId);
    return this.httpClient.post(this.createBoardUrl, {userId: userId});
  }

}
