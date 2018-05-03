import { Component, OnInit } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {GetService} from "../../services/get.service";

@Component({
  selector: "app-white-board",
  templateUrl: "./white-board.component.html",
  styleUrls: ["./white-board.component.css"]
})
export class WhiteBoardComponent implements OnInit {

  private userId: string;
  private userName: string;
  private showTools: boolean;
  private boardId: string;
  constructor(private cookieService: CookieService
            , private router: Router
            , private getService: GetService) { }

  ngOnInit() {
    if (this.cookieService.get('userId') !== '') {
      this.userId = this.cookieService.get('userId');
      this.userName = this.cookieService.get('userName');
      this.showTools = this.cookieService.get('userType') !== 'student';
      console.log("Show Tools: " + this.showTools);
    } else {
      this.router.navigate([""]);
    }
    const urlArr = window.location.href.split("/");
    this.boardId = urlArr.pop();
    this.getService.isBoardExists(this.boardId).subscribe(val => {
      console.log("Exits:");
      console.log(val);
      if (val["msg"] === "Not Exists") {
        this.router.navigate(["/profile"]);
      }
    });
    console.log("User id:", this.userId, "Board id:", this.boardId);
  }
  onLogged(e) {
    console.log("log out now!!");
    this.router.navigate(["/login"]);
  }
}
