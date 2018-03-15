import {Component, ElementRef, HostListener, OnInit, ViewChild} from "@angular/core";

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

  private user = {
    name: "",
    email: "",
    password: "",
    type: ""
  };

  @ViewChild("dropDownWindow") dropDownWindow: ElementRef;

  constructor() { }

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


}
