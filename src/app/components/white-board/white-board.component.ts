import { Component, OnInit } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Component({
  selector: "app-white-board",
  templateUrl: "./white-board.component.html",
  styleUrls: ["./white-board.component.css"]
})
export class WhiteBoardComponent implements OnInit {

  private userId: string;
  private boardId: string;
  constructor(private cookieService: CookieService
              , private router: Router) { }

  ngOnInit() {
    if (this.cookieService.get('userId') !== '') {
      this.userId = this.cookieService.get('userId');
    } else {
      this.router.navigate([""]);
    }
    const urlArr = window.location.href.split("/");
    this.boardId = urlArr.pop();
    console.log("User id:", this.userId, "Board id:", this.boardId);
  }
  onLogged(e) {
    console.log("log out now!!");
    this.router.navigate(["/login"]);
  }
}
