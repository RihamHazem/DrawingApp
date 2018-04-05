import {Component, ElementRef, HostListener, OnInit, ViewChild} from "@angular/core";
import {CookieService} from 'ngx-cookie';
import {Router} from '@angular/router';

@Component({
  selector: "app-top-tool-bar",
  templateUrl: "./top-tool-bar.component.html",
  styleUrls: ["./top-tool-bar.component.css"]
})
export class TopToolBarComponent implements OnInit {

  private showSettingsMenu = false;
  private showProfileMenu = false;
  private showAllMenu = false;
  private hideTopBar = false;
  private showWholeWindow = false;

  private userName: string;

  @ViewChild("dropDownWindow") dropDownWindow: ElementRef;

  constructor(private cookieService: CookieService
              , private router: Router) {
    if (cookieService.get('userId') !== undefined) {
      this.userName = cookieService.get('userName');
    }
  }

  ngOnInit() {
    this.doResponsive();
  }
  @HostListener("window:resize", ["$event"])
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
  logOut(e) {
    e.preventDefault();
    this.cookieService.remove('userId', {domain: 'localhost:4200'});
    this.cookieService.remove('userName');
    this.router.navigate([""]);
  }

}
