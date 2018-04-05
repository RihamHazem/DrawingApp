import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {GetService} from "../../services/get.service";
import {Router} from "@angular/router";
import {CookieService} from 'ngx-cookie';

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  @ViewChild("accountDetails") accountDetails: ElementRef;
  @ViewChild("savedBoards") savedBoards: ElementRef;
  private currentTab: any;
  private userId: string;
  constructor(private getService: GetService
              , private router: Router
              , private cookieService: CookieService) { }

  ngOnInit() {
    const urlArr = window.location.href.split("/");
    this.currentTab = urlArr.pop();
    if (this.currentTab === "saved-boards") {
      this.addSelectedSavedBoards();
    } else if (this.currentTab === "account-details") {
      this.addSelectedAccountDetails();
    } else {
      this.addSelectedAccountDetails();
    }
    if (this.cookieService.get('userId') !== undefined) {
      this.userId = this.cookieService.get('userId');
      console.log(this.userId);
    } else {
      this.router.navigate([""]);
    }
  }

  addSelectedAccountDetails() {
    if (!this.accountDetails.nativeElement.classList.contains("selected")) {
      this.accountDetails.nativeElement.classList.add("selected");
    }
    this.savedBoards.nativeElement.classList.remove("selected");
  }
  addSelectedSavedBoards() {
    if (!this.savedBoards.nativeElement.classList.contains("selected")) {
      this.savedBoards.nativeElement.classList.add("selected");
    }
    this.accountDetails.nativeElement.classList.remove("selected");
  }

  createNewRoom() {
    this.getService.createNewRoom(this.userId).subscribe(val => {
      console.log(val);
      this.router.navigate(["/board", val["id"]]);
    });
  }

}
