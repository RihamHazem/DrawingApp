import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-top-tool-bar',
  templateUrl: './top-tool-bar.component.html',
  styleUrls: ['./top-tool-bar.component.css']
})
export class TopToolBarComponent implements OnInit {

  private showSettingsMenu: boolean = false;
  private showProfileMenu: boolean = false;
  private showAllMenu: boolean = false;
  private signedIn: boolean = true; // initialized from backend
  private hideTopBar: boolean = false;

  @ViewChild('logIn') logIn: ElementRef;
  @ViewChild('dropDownWindow') dropDownWindow: ElementRef;

  constructor() { }

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
  private showWholeWindow: boolean = false;
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
    this.logIn.nativeElement.style.display = "block";
    this.hideAllMenus();
  }
  hideSignInWindow() {
    this.logIn.nativeElement.style.display = "none";
  }

}
