import {Component, Input, OnInit} from "@angular/core";
import {GetService} from "../../services/get.service";
import {CookieService} from "ngx-cookie";
import {Router} from "@angular/router";
import {NavbarAndCanvasCommunicationService} from "../../services/navbar-and-canvas-communication.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: "app-saved-boards",
  templateUrl: "./saved-boards.component.html",
  styleUrls: ["./saved-boards.component.css"]
})
export class SavedBoardsComponent implements OnInit {
  private images = [];
  private boardNames = [];
  private boardIds = [];
  private hostName = environment.BackEnd_url;
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
        if (val[valKey]["imagePath"].length === 0) continue;
        this.images.push(val[valKey]["imagePath"]);
        this.boardNames.push(val[valKey]["boardName"]);
        this.boardIds.push(val[valKey]["_id"]);
      }
    });
  }

  deleteBoard(index) {
    // TODO: You have to delete the image from database also
    this.getService.deleteRoom(this.boardIds[index]).subscribe(val => {
      console.log(val);
      this.images.splice(index, 1);
      this.boardNames.splice(index, 1);
      this.boardIds.splice(index, 1);
    });
  }

  navigateToBoard(i) {
    console.log("Navigating");
    this.router.navigate(['/board', this.boardNames[i], this.boardIds[i]]);
    this.shared.sendImagePath(this.images[i]);
  }
}
