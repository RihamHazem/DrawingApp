import { Component, OnInit } from '@angular/core';
import {WebSocketService} from "../../services/web-socket.service";
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  winner: String = '' ;
  image2: String = '' ;
  URL1: String = '';
  URL2: String = '';
  URL3: String = '';
  URL4: String = '';
  URL5: String = '';
  URL6: String = '';
  URL7: String = '';
  URL8: String = '';
  URL9: String = '';
  grid: String[][] = [ ['1', '2', '3'], ['4', '5', '6'] , ['7', '8', '9']];
  private cnt = 0;
  private turn: string = "X";
  private userName: string = "X";
  private isChecked: string = "";
  private beginGame: boolean = false;
  constructor(private game: WebSocketService) {
  }
  ngOnInit() {
    this.game.getGame().subscribe((msg: {userName: string, i: number, j: number}) => {
      console.log("msg: ", msg);
      if (msg === undefined) {
        return;
      } else {
        if (msg.userName === 'X' && msg.userName === this.turn) {
          this.image2 = "../../../assets/images/x.png";
          this.gameLogic(msg.i, msg.j, msg.userName, this.image2);
          this.turn = "Y";
        } else if (msg.userName === 'Y' && msg.userName === this.turn) {
          this.image2 = "../../../assets/images/y.png";
          this.gameLogic(msg.i, msg.j, msg.userName, this.image2);
          this.turn = "X";
        }
      }
    });
  }
  play(i, j) {
    // if (this.userName === 'X') {
    //   this.image = "../../../assets/images/x.png";
    // } else if ( this.userName === 'Y') {
    //   this.image  = "../../../assets/images/y.png";
    // }
    this.game.sendGame(this.userName, i, j);
    // this.gameLogic(i, j, this.userName, this.image);
  }
  gameLogic(i, j, name, image) {
    console.log("Game Logic", i, j);
    if (i === 0 && j === 0) {
      this.URL1 = image;
      this.grid[i][j] = name ;
      this.cnt++;
    } else if (i === 0 && j === 1) {
      this.URL2 = image;
      this.grid[i][j] = name;
      this.cnt++;
    } else if (i === 0 && j === 2) {
      this.URL3 = image;
      this.grid[i][j] = name ;
      this.cnt++;
    } else if (i === 1 && j === 0) {
      this.URL4 = image;
      this.grid[i][j] = name ;
      this.cnt++;
    } else if (i === 1 && j === 1) {
      this.URL5 = image;
      this.grid[i][j] = name ;
      this.cnt++;
    } else if (i === 1 && j === 2) {
      this.URL6 = image;
      this.grid[i][j] = name ;
      this.cnt++;
    } else if (i === 2 && j === 0) {
      this.URL7 = image;
      this.grid[i][j] = name ;
      this.cnt++;
    } else if (i === 2 && j === 1) {
      this.URL8 = image;
      this.grid[i][j] = name ;
      this.cnt++;
    } else if (i === 2 && j === 2) {
      this.URL9 = image;
      this.grid[i][j] = name;
      this.cnt++;
    }
    if (this.grid[0][0] === this.grid[0][1] && this.grid[0][0] === this.grid[0][2]) {
      this.winner = "Winner is " + this.grid[0][0];
    } else if (this.grid[1][0] === this.grid[1][1] && this.grid[1][0] === this.grid[1][2]) {
      this.winner = "Winner is " + this.grid[1][0];
    } else if (this.grid[2][0] === this.grid[2][1] && this.grid[2][0] === this.grid[2][2]) {
      this.winner = "Winner is " + this.grid[2][0];
    } else if (this.grid[0][0] === this.grid[1][0] && this.grid[0][0] === this.grid[2][0]) {
      this.winner = "Winner is " + this.grid[0][0];
    } else if (this.grid[0][1] === this.grid[1][1] && this.grid[0][1] === this.grid[2][1]) {
      this.winner = "Winner is " + this.grid[0][1];
    } else if (this.grid[0][2] === this.grid[1][2] && this.grid[0][2] === this.grid[2][2]) {
      this.winner = "Winner is " + this.grid[0][2];
    } else if (this.grid[0][0] === this.grid[1][1] && this.grid[0][0] === this.grid[2][2]) {
      this.winner = "Winner is " + this.grid[0][0];
    } else if (this.grid[0][2] === this.grid[2][0] && this.grid[0][2] === this.grid[1][1]) {
      this.winner = "Winner is " + this.grid[0][2];
    }
    if (this.cnt === 9) {
      this.winner = "No Winner it's DRAW";

    }
  }
  assignTurn() {
    this.beginGame = true;
    console.log(this.isChecked);
    if (this.isChecked === "x") {
      this.userName = "X";
    } else {
      this.userName = "Y";
    }
  }
}
