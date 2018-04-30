import { Component, OnInit } from "@angular/core";
import { CookieService } from 'ngx-cookie';

@Component({
  selector: "app-profile-info",
  templateUrl: "./profile-info.component.html",
  styleUrls: ["./profile-info.component.css"]
})
export class ProfileInfoComponent implements OnInit {
  private userName: string = "";
  private userEmail: string = "";
  private userType: string = "";
  constructor(private cookieService: CookieService) {
    this.userName = cookieService.get("userName");
    this.userEmail = cookieService.get("userEmail");
    this.userType = cookieService.get("userType");
  }

  ngOnInit() {
  }

}
