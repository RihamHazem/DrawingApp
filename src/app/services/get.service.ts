import { HttpClient } from "@angular/common/http";
import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";

@Injectable()
export class GetService {
  private signUpUrl = "http://localhost:3000/signUp";
  private logInUrl = "http://localhost:3000/logIn";
  constructor(private httpClient: HttpClient) { }

  createNewUser(user: {name: string, email: string, password: string, type: string}): Observable<any> {
    return this.httpClient.post(this.signUpUrl, user);
  }
  logInUser(user: {email: string, password}): Observable<any> {
    return this.httpClient.post(this.logInUrl, user);
  }

}
