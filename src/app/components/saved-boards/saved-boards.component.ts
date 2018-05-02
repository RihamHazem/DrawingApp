import {Component, Input, OnInit} from "@angular/core";
import {GetService} from "../../services/get.service";
import {CookieService} from "ngx-cookie";
import {Router} from "@angular/router";
import {NavbarAndCanvasCommunicationService} from "../../services/navbar-and-canvas-communication.service";

@Component({
  selector: "app-saved-boards",
  templateUrl: "./saved-boards.component.html",
  styleUrls: ["./saved-boards.component.css"]
})
export class SavedBoardsComponent implements OnInit {
  private images = [];
  private boardNames = [];
  private boardIds = [];
  @Input() userId: string;
  constructor(private getService: GetService
            , private cookieService: CookieService
            , private router: Router
            , private shared: NavbarAndCanvasCommunicationService) {
  //  TODO: You have to load the images array from database
    this.userId = cookieService.get("userId");
    this.loadBoards();
  }

  ngOnInit() {
  }

  loadBoards() {
    this.getService.getUserSavedBoards(this.userId).subscribe(val => {
      for (let valKey in val) {
        console.log(val[valKey]);
        if (val[valKey]["imagePath"].length === 0) continue;
        this.images.push(val[valKey]["imagePath"]);
        this.boardNames.push(val[valKey]["boardName"]);
        this.boardIds.push(val[valKey]["_id"]);
      }
    });
  }

  deleteBoard(index) {
    this.images.splice(index, 1);
    console.log(this.images);
    // TODO: You have to delete the image from database also
  }

  navigateToBoard(i) {
    console.log("Navigating");
    this.router.navigate(['/board', this.boardNames[i], this.boardIds[i]]);
    this.shared.sendImagePath(this.images[i]);
  }
}
