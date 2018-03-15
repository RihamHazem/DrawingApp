import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {GetService} from "../../services/get.service";
import { Router } from "@angular/router";

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

  constructor(private getService: GetService, private router: Router) { }

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
      this.errorMsg = "Please fill all fields!";
      this.error = true;
      return;
    }
    if (this.user.type === "student" || this.user.type === "teacher") {
      this.getService.createNewUser(this.user).subscribe(val => {
        if (val.message === "Successfully added the user.") {
          this.user.id = val["createdUser"]["_id"];
          this.router.navigate(["/profile", this.user.id]);
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
      !this.user.password.length) {
      this.errorMsg = "Please fill all fields!";
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
        this.user.name = val.foundUser.name;
        this.user.id = val.foundUser._id;
        this.router.navigate(["/profile", this.user.id]);
      }
    });
  }
  setUserType(e) {
    this.user.type = e.target.value;
  }
}
