import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";

@Component({
  selector: "app-saved-boards",
  templateUrl: "./saved-boards.component.html",
  styleUrls: ["./saved-boards.component.css"]
})
export class SavedBoardsComponent implements OnInit {
  private images = ["drawing.png", "drawing2.png", "drawing3.png", "drawing4.png", "drawing5.png"];
  constructor() {
  //  TODO: You have to load the images array from database
  }

  ngOnInit() {
  }

  deleteBoard(index) {
    this.images.splice(index, 1);
    console.log(this.images);
    // TODO: You have to delete the image from database also
  }

}
