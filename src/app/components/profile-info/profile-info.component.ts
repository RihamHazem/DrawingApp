import { Component, OnInit } from "@angular/core";
import { CookieService } from 'ngx-cookie';
import {environment} from "../../../environments/environment";

@Component({
  selector: "app-profile-info",
  templateUrl: "./profile-info.component.html",
  styleUrls: ["./profile-info.component.css"]
})
export class ProfileInfoComponent implements OnInit {
  private userName: string = "";
  private userEmail: string = "";
  private userType: string = "";
  private userImage: string = "";
  private hostName: string = "";
  constructor(private cookieService: CookieService) {
    this.userName = cookieService.get("userName");
    this.userEmail = cookieService.get("userEmail");
    this.userType = cookieService.get("userType");
    this.userImage = cookieService.get('userImage');
    this.hostName = environment.BackEnd_url;
  }

  ngOnInit() {
  }

}
