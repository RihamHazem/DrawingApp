import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { AppComponent } from './app.component';
import { DrawingAreaComponent } from './components/drawing-area/drawing-area.component';
import { LeftToolBarComponent } from './components/left-tool-bar/left-tool-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NavbarAndCanvasCommunicationService} from "./services/navbar-and-canvas-communication.service";
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { WhiteBoardComponent } from './components/white-board/white-board.component';
import { TopToolBarComponent } from './components/top-tool-bar/top-tool-bar.component';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { SavedBoardsComponent } from './components/saved-boards/saved-boards.component';
import { TestComponent } from './components/test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    DrawingAreaComponent,
    LeftToolBarComponent,
    UserProfileComponent,
    WhiteBoardComponent,
    TopToolBarComponent,
    ProfileInfoComponent,
    SavedBoardsComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: WhiteBoardComponent
      },
      {
        path: 'drawing',
        component: WhiteBoardComponent
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        children: [
          {
            path: '',
            component: ProfileInfoComponent
          },
          {
            path: 'account-details',
            component: ProfileInfoComponent
          },
          {
            path: 'saved-boards',
            component: SavedBoardsComponent
          }
        ]
      },
      {
        path: '**',
        component: WhiteBoardComponent
      }
    ])
  ],
  providers: [NavbarAndCanvasCommunicationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
