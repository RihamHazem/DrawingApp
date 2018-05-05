// ***** Import Modules ***** //
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";
import {
  FormsModule,
} from '@angular/forms';
import { ParticlesModule } from 'angular-particle';
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
import {CookieService} from 'ngx-cookie-service';
import {CookieModule} from 'ngx-cookie';
import { ChatComponent } from './components/chat/chat.component';
import { GameComponent } from './components/game/game.component';

const config: SocketIoConfig = { url: environment.BackEnd_url, options: {} };
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
    LogInSignUpComponent,
    ChatComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ParticlesModule,
    SocketIoModule.forRoot(config),
    CookieModule.forRoot(),
    RouterModule.forRoot([
      {
        path: "",
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
        path: "login",
        component: LogInSignUpComponent
      },
      {
        path: "board",
        component: WhiteBoardComponent
      },
      {
        path: "board/:boardName/:boardId",
        component: WhiteBoardComponent
      },
      {
        path: "profile",
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
        path: "chat",
        component: ChatComponent
      },
      {
        path: "game",
        component: GameComponent
      },
      {
        path: "**",
        component: LogInSignUpComponent
      }
    ])
  ],
  providers: [NavbarAndCanvasCommunicationService
    , GetService
    , ChatService
    , WebSocketService
    , CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
