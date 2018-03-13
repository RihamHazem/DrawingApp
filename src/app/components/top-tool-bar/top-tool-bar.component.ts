import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {GetService} from '../../services/get.service';

@Component({
  selector: 'app-top-tool-bar',
  templateUrl: './top-tool-bar.component.html',
  styleUrls: ['./top-tool-bar.component.css']
})
export class TopToolBarComponent implements OnInit {

  private showSettingsMenu: boolean = false;
  private showProfileMenu: boolean = false;
  private showAllMenu: boolean = false;
  private signedIn: boolean = false; // initialized from backend
  private hideTopBar: boolean = false;
  private showWholeWindow: boolean = false;
  private error: boolean = false;
  private errorMsg: string = 'Please fill all the fields!';
  private user = {
    name: '',
    email: '',
    password: '',
    type: ''
  };

  @ViewChild('logIn') logIn: ElementRef;
  @ViewChild('signUp') signUp: ElementRef;
  @ViewChild('dropDownWindow') dropDownWindow: ElementRef;

  constructor(private getService: GetService) { }

  ngOnInit() {
    this.doResponsive();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.doResponsive();
  }

  doResponsive() {
    this.hideTopBar = (window.innerWidth <= 768);
  }
  toggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu;
    this.showWholeWindow = !this.showWholeWindow;
  }
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    this.showWholeWindow = !this.showWholeWindow;
  }
  toggleAllMenu() {
    this.showAllMenu = !this.showAllMenu;
    this.showWholeWindow = !this.showWholeWindow;
  }

  hideAllMenus() {
    this.showAllMenu = false;
    this.showProfileMenu = false;
    this.showSettingsMenu = false;
    this.showWholeWindow = false;
  }

  showSignInWindow() {
    this.signUp.nativeElement.style.display = 'none';
    this.logIn.nativeElement.style.display = 'block';
    this.hideAllMenus();
  }
  hideSignInWindow(e) {
    if (e.target === e.currentTarget) {
      this.logIn.nativeElement.style.display = 'none';
    }
  }
  showSignUpWindow() {
    this.logIn.nativeElement.style.display = 'none';
    this.signUp.nativeElement.style.display = 'block';
    this.hideAllMenus();
  }
  hideSignUpWindow(e) {
    if (e.target === e.currentTarget) {
      this.signUp.nativeElement.style.display = 'none';
    }
  }
  submitUser() {
    if (this.user.type === 'student' || this.user.type === 'teacher') {
      this.getService.createNewUser(this.user).subscribe(val => {
        this.errorMsg = val;
        if (this.errorMsg === 'Successfully added the user.') {
          this.error = false;
          this.signedIn = true;
          this.hideAllMenus();
          this.signUp.nativeElement.style.display = 'none';
        } else {
          this.error = true;
        }
      });
    } else {
      console.log(this.user.type);
      this.error = true;
    }
  }
  signInUser() {
    let result;
    this.getService.logInUser({
          email: this.user.email,
          password: this.user.password
    }).subscribe(val => {
      result = val;
      if (result.message === 'User not found.') {
        this.errorMsg = result.message;
        this.error = true;
      } else {
        console.log(result);
        this.user.name = result.foundUser.name;
        this.error = false;
        this.signedIn = true;
        this.hideAllMenus();
        this.logIn.nativeElement.style.display = 'none';
      }
    });
  }
  setUserType(e) {
    this.user.type = e.target.value;
  }

}
