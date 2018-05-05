import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {GetService} from "../../services/get.service";
import {Router} from "@angular/router";
import { CookieService } from 'ngx-cookie';

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  @ViewChild("accountDetails") accountDetails: ElementRef;
  @ViewChild("savedBoards") savedBoards: ElementRef;
  @ViewChild("activePos") activePos: ElementRef;
  private currentTab: any;
  private userId: string;
  private hidePopUp: boolean = true;
  private boardName: string = "";
  private errorMsg: boolean = false;
  constructor(private getService: GetService
              , private router: Router
              , private cookieService: CookieService) { }

  ngOnInit() {
    const urlArr = window.location.href.split("/");
    this.currentTab = urlArr.pop();
    if (this.currentTab === "saved-boards") {
      this.addSelectedSavedBoards();
    } else {
      this.addSelectedAccountDetails();
    }
    if (this.cookieService.get('userId') !== undefined) {
      this.userId = this.cookieService.get('userId');
      console.log(this.userId);
    } else {
      this.router.navigate(["/login"]);
    }
  }
  addSelectedAccountDetails() {
    if (!this.accountDetails.nativeElement.classList.contains("selected")) {
      this.accountDetails.nativeElement.classList.add("selected");
    }
    this.savedBoards.nativeElement.classList.remove("selected");
    this.activePos.nativeElement.style.right =  String(window.innerWidth/2 + 5) + "px";
    this.router.navigate(["/account-details"]);
  }
  addSelectedSavedBoards() {
    if (!this.savedBoards.nativeElement.classList.contains("selected")) {
      this.savedBoards.nativeElement.classList.add("selected");
    }
    this.accountDetails.nativeElement.classList.remove("selected");
    if ( window.innerWidth >= 769 )
      this.activePos.nativeElement.style.right =  String(window.innerWidth/2 - 142) + "px";
    else
      this.activePos.nativeElement.style.right = String(window.innerWidth/2 - 105) + "px";
    this.router.navigate(["/saved-boards"]);
  }

  createNewRoom() {
    if (this.boardName == "") {
      this.errorMsg = true;
      return;
    }
    this.getService.createNewRoom(this.userId, this.boardName).subscribe(val => {
      console.log(val + ".." + this.boardName);
      this.router.navigate(["/board", this.boardName, val["id"]]);
    });
  }
  navigateGame() {
    this.router.navigate(["/game"]);
  }
  togglePopUpVisibility() {
    this.hidePopUp = !this.hidePopUp;
  }
  logOut() {
    this.router.navigate(["/login"]);
  }
}
