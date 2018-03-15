// ***** Import Modules ***** //
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
// ***** Import My Components ***** //
import { AppComponent } from "./app.component";
import { LogInSignUpComponent } from "./components/log-in-sign-up/log-in-sign-up.component";
import { DrawingAreaComponent } from "./components/drawing-area/drawing-area.component";
import { LeftToolBarComponent } from "./components/left-tool-bar/left-tool-bar.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { WhiteBoardComponent } from "./components/white-board/white-board.component";
import { TopToolBarComponent } from "./components/top-tool-bar/top-tool-bar.component";
import { ProfileInfoComponent } from "./components/profile-info/profile-info.component";
import { SavedBoardsComponent } from "./components/saved-boards/saved-boards.component";
import { TestComponent } from "./components/test/test.component";
// ***** Import My Services ***** //
import { GetService } from "./services/get.service";
import { NavbarAndCanvasCommunicationService } from "./services/navbar-and-canvas-communication.service";
import { ChatService } from "./services/chat.service";
import { WebSocketService } from "./services/web-socket.service";
import {environment} from "../environments/environment";

const config: SocketIoConfig = { url: environment.ws_url, options: {} };
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
    TestComponent,
    LogInSignUpComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot([
      {
        path: "",
        component: LogInSignUpComponent
      },
      {
        path: "drawing",
        component: WhiteBoardComponent
      },
      {
        path: "profile/:id",
        component: UserProfileComponent,
        children: [
          {
            path: "",
            component: ProfileInfoComponent
          },
          {
            path: "account-details",
            component: ProfileInfoComponent
          },
          {
            path: "saved-boards",
            component: SavedBoardsComponent
          }
        ]
      },
      {
        path: "**",
        component: LogInSignUpComponent
      }
    ])
  ],
  providers: [NavbarAndCanvasCommunicationService, GetService, ChatService, WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
