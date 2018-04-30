import {Component, ElementRef, OnChanges, OnInit, ViewChild} from "@angular/core";
import {GetService} from "../../services/get.service";
import { Router } from "@angular/router";
// import { CookieService } from 'ngx-cookie';
import { CookieService} from "ngx-cookie-service";

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
  myStyle: object = {};
  myParams: object = {};
  width: number = 100;
  height: number = 100;
  @ViewChild("logIn") logIn: ElementRef;
  @ViewChild("signUp") signUp: ElementRef;

  constructor(private getService: GetService
    , private router: Router
    , private cookieService: CookieService) {
  }
  private img = "assets/images/4.png";
  ngOnInit() {
    this.cookieService.deleteAll("/", "localhost");
    this.myStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': -1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
      'background-color': '#2E2F44'
    };
    this.myParams = {
      particles: {
        number: {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 900
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          type: "star",
          stroke: {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": this.img,
            "width": 20,
            "height": 20
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 10,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 80,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 2
        },
        "move": {
          "enable": true,
          "speed": 5,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "repulse"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 800,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 800,
            "size": 80,
            "duration": 2,
            "opacity": 0.8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    };
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
          this.cookieService.set("userId", this.user.id);
          this.cookieService.set("userName", this.user.name);
          this.cookieService.set("userEmail", this.user.email);
          this.cookieService.set("userType", this.user.type);
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
        this.user.name = val["foundUser"]["name"];
        this.user.id = val["foundUser"]["_id"];
        this.user.email = val["foundUser"]["email"];
        this.user.type = val["foundUser"]["type"];
        this.cookieService.set("userId", this.user.id);
        this.cookieService.set("userName", this.user.name);
        this.cookieService.set("userEmail", this.user.email);
        this.cookieService.set("userType", this.user.type);
        this.router.navigate(["/profile"]);
      }
    });
  }

  setUserType(e) {
    this.user.type = e.target.value;
  }
}
