import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('accountDetails') accountDetails: ElementRef;
  @ViewChild('savedBoards') savedBoards: ElementRef;
  private currentTab: any;
  constructor() { }

  ngOnInit() {
    let urlArr = window.location.href.split('/');
    this.currentTab = urlArr.pop();
    if(this.currentTab === "saved-boards") {
      this.addSelectedSavedBoards();
    } else if(this.currentTab === "acount-details") {
      this.addSelectedAccountDetails();
    } else {
      this.addSelectedAccountDetails();
    }
  }

  addSelectedAccountDetails() {
    if(!this.accountDetails.nativeElement.classList.contains('selected'))
      this.accountDetails.nativeElement.classList.add('selected');
    this.savedBoards.nativeElement.classList.remove('selected');
  }
  addSelectedSavedBoards() {
    if(!this.savedBoards.nativeElement.classList.contains('selected'))
      this.savedBoards.nativeElement.classList.add('selected');
    this.accountDetails.nativeElement.classList.remove('selected');
  }

}
