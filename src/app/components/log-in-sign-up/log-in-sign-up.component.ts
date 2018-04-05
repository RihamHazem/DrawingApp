import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {GetService} from "../../services/get.service";
import { Router } from "@angular/router";
import {CookieService} from 'ngx-cookie';

@Component({
  selector: "app-log-in-sign-up",
  templateUrl: "./log-in-sign-up.component.html",
  styleUrls: ["./log-in-sign-up.component.css"]
})
export class LogInSignUpComponent implements OnInit {
  private error = false;
  private errorMsg = "Please fill all the fields!";
  private user = {
    id: "",
    name: "",
    email: "",
    password: "",
    type: ""
  };

  @ViewChild("logIn") logIn: ElementRef;
  @ViewChild("signUp") signUp: ElementRef;

  constructor(private getService: GetService
              , private router: Router
              , private cookieService: CookieService) {
    if (cookieService.get('userId') !== undefined) {
      console.log(cookieService.get('userId'));
      // router.navigate(['/profile']);
    }
  }

  ngOnInit() {
  }

  showSignInWindow() {
    this.error = false;
    this.signUp.nativeElement.style.display = "none";
    this.logIn.nativeElement.style.display = "block";
  }
  hideSignInWindow(e) {
    if (e.target === e.currentTarget) {
      this.logIn.nativeElement.style.display = "none";
    }
  }
  showSignUpWindow() {
    this.error = false;
    this.logIn.nativeElement.style.display = "none";
    this.signUp.nativeElement.style.display = "block";
  }
  hideSignUpWindow(e) {
    if (e.target === e.currentTarget) {
      this.signUp.nativeElement.style.display = "none";
    }
  }
  submitUser() {
    if (!this.user.email.length ||
      !this.user.password.length ||
      !this.user.name.length) {
      this.errorMsg = "Please fill all fields correctly!";
      this.error = true;
      return;
    }
    if ((this.user.type === "student" || this.user.type === "teacher") && this.user.email.match("(.*)@(.*)\\.(.*)") != null) {
      this.getService.createNewUser(this.user).subscribe(val => {
        if (val.message === "Successfully added the user.") {
          this.user.id = val["createdUser"]["_id"];
          this.router.navigate(["/profile"]);
          this.cookieService.put("userId", this.user.id);
          this.cookieService.put("userName", this.user.name);
        } else {
          this.errorMsg = val.message;
          this.error = true;
        }
      });
    } else {
      this.errorMsg = "Please fill all fields!";
      console.log(this.user.type);
      this.error = true;
    }
  }
  signInUser() {
    if (!this.user.email.length ||
      !this.user.password.length || this.user.email.match("(.*)@(.*)\\.(.*)") === null) {
      this.errorMsg = "Please fill all fields correctly!";
      this.error = true;
      return;
    }
    this.getService.logInUser({
      email: this.user.email,
      password: this.user.password
    }).subscribe(val => {
      if (val.message === "User not found.") {
        this.errorMsg = val.message;
        this.error = true;
      } else {
        console.log(val);
        this.user.name = val["foundUser"].name;
        this.user.id = val["foundUser"]._id;
        this.cookieService.put("userId", this.user.id);
        this.cookieService.put("userName", this.user.name);
        this.router.navigate(["/profile"]);
      }
    });
  }
  setUserType(e) {
    this.user.type = e.target.value;
  }
}
