import {Component, ElementRef, HostListener, OnInit, Output, ViewChild, EventEmitter} from "@angular/core";
import { CookieService } from 'ngx-cookie';
import {ActivatedRoute} from '@angular/router';

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
  private boardName: string = "";
  private userName: string;
  @Output() onLog = new EventEmitter<boolean>();

  @ViewChild("dropDownWindow") dropDownWindow: ElementRef;

  constructor(private cookieService: CookieService
              , private routeParam: ActivatedRoute) {
    if (cookieService.get('userId') !== undefined) {
      this.userName = cookieService.get('userName').split(" ")[0];
    }
    routeParam.params.subscribe(boardInfo => {
      this.boardName = boardInfo["boardName"];
    });
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
    console.log("I'm tryiing to log out");
    this.onLog.emit(true);
  }

}
