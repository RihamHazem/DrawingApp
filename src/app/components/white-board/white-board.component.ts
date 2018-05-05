import {Component, OnInit, ViewChild} from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {GetService} from "../../services/get.service";
import {DrawingAreaComponent} from "../drawing-area/drawing-area.component";

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
  private boardName: string;
  private imagePath: string = "";
  constructor(private cookieService: CookieService
            , private router: Router
            , private getService: GetService) { }
  @ViewChild(DrawingAreaComponent) drawComponent;

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
    this.boardName = urlArr.pop();
    /** Find from database if board exists **/
    this.getService.isBoardExists(this.boardId).subscribe(val => {
      console.log("Exits:", val);
      if (val["msg"] === "Not Exists") {
        this.router.navigate(["/profile"]);
      } else {
        this.imagePath = val["imagePath"];
        this.drawComponent.loadImageFirst(this.imagePath);
      }
    });
    console.log("User id:", this.userId, "Board id:", this.boardId);
  }
  onLogged(e) {
    console.log("log out now!!");
    this.router.navigate(["/login"]);
  }
}
