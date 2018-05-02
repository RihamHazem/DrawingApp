import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { NavbarAndCanvasCommunicationService } from "../../services/navbar-and-canvas-communication.service";
import {WebSocketService} from "../../services/web-socket.service";
import {GetService} from '../../services/get.service';

@Component({
  selector: "app-drawing-area",
  templateUrl: "./drawing-area.component.html",
  styleUrls: ["./drawing-area.component.css"]
})
export class DrawingAreaComponent implements OnInit {
  public static curRow = 0;
  private selectedTool: string;
  private lastSelected: string;
  private mouseDown = false;
  private pencilInfo = {
    radius: 2,
    x: 0,
    y: 0,
    color: "#000000"
  };
  private eraserInfo = {
    radius: 2,
    x: 0,
    y: 0,
    color: "#f2f2f2"
  };
  private textInputs = [];
  private context: any;
  private colorText = "#000000";
  private colorNote = "rgb(255, 247, 205)";
  private paths: any;
  private otherPaths: any;
  private textSize: any;
  private noteTime = false;
  private myNotes = [];
  private holder: any = null;
  private mouseStart: {x: number, y: number} = {
    x: 0,
    y: 0
  };
  private otherUserName: string = "";
  @Input() userId: string;
  @Input() userName: string;
  @Input('boardId') boardId: string;
  @Input() student: boolean;

  @ViewChild("myCanvas") canvas: ElementRef;
  @ViewChild("textInputs") textContainer: ElementRef;
  @ViewChild("notes") noteContainer: ElementRef;
  @ViewChild("downloadImage") downloadImage: ElementRef;
  @ViewChild("otherUser") otherUser: ElementRef;

  constructor(private shared: NavbarAndCanvasCommunicationService
              , private board: WebSocketService
              , private getService: GetService) {
    this.paths = [[]];
    this.otherPaths = [[]];
  }
  // ***** Static Functions Begin ***** //
  static getKeyPressed(e) {
    if (e.key === "Enter") {
      DrawingAreaComponent.curRow += 1;
      if (DrawingAreaComponent.curRow === e.target.rows) {
        e.target.rows++;
      }
    }
  }
  // ***** Static Functions End ***** //

  ngOnInit() {
    this.doResponsive();
    this.context = this.canvas.nativeElement.getContext("2d");
    this.context.lineWidth = this.pencilInfo.radius * 2;

    this.shared.selectedTool.subscribe(tool => this.changeTool(tool));
    this.board.addUser(this.userId, this.boardId);
    this.board.getPoint().subscribe(point => {
      const otherPoint = point["point"];
      if (point["userId"] !== this.userId) { // it's not my turn so I should update drawing
        // Save the text in paths
        if (this.otherPaths == undefined || this.otherPaths.length === 0) {
          this.otherPaths.push([]);
        }
        if (this.paths == undefined || this.paths.length === 0) {
          this.paths.push([]);
        }
        this.otherPaths[this.otherPaths.length - 1].push({
          type: this.selectedTool,
          x: otherPoint.x,
          y: otherPoint.y,
          radius: otherPoint.radius,
          color: otherPoint.color
        });

        this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        for (let i = 0; i < this.paths.length; i++) {
          if  (this.paths[i].length === 0 || this.paths[i][0] === undefined) break;
          this.context.lineWidth = this.paths[i][0].radius * 2;
          for (let j = 0; j < this.paths[i].length; j++) {
            this.drawPoint(this.paths[i][j]);
          }
          this.context.beginPath();
        }
        for (let i = 0; i < this.otherPaths.length; i++) {
          if  (this.otherPaths[i].length === 0 || this.otherPaths[i][0] === undefined) break;
          this.context.lineWidth = this.otherPaths[i][0].radius * 2;
          for (let j = 0; j < this.otherPaths[i].length; j++) {
            this.drawPoint(this.otherPaths[i][j]);
          }
          this.context.beginPath();
        }
        this.otherUser.nativeElement.style.top = otherPoint.y + "px";
        this.otherUser.nativeElement.style.left = otherPoint.x + "px";
        this.otherUserName = point["userName"];
        // this.context.closePath();
      } else {
        if (this.otherPaths == undefined || this.otherPaths.length === 0) {
          this.otherPaths.push([]);
        }
        if (this.paths == undefined || this.paths.length === 0) {
          this.paths.push([]);
        }
        this.paths[this.paths.length - 1].push({
          type: this.selectedTool,
          x: otherPoint.x,
          y: otherPoint.y,
          radius: otherPoint.radius,
          color: otherPoint.color
        });

        this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        for (let i = 0; i < this.paths.length; i++) {
          if  (this.paths[i].length === 0 || this.paths[i][0] === undefined) break;
          this.context.lineWidth = this.paths[i][0].radius * 2;
          for (let j = 0; j < this.paths[i].length; j++) {
            this.drawPoint(this.paths[i][j]);
          }
          this.context.beginPath();
        }
        for (let i = 0; i < this.otherPaths.length; i++) {
          if  (this.otherPaths[i].length === 0 || this.otherPaths[i][0] === undefined) break;
          this.context.lineWidth = this.otherPaths[i][0].radius * 2;
          for (let j = 0; j < this.otherPaths[i].length; j++) {
            this.drawPoint(this.otherPaths[i][j]);
          }
          this.context.beginPath();
        }
      }
    });
    this.board.getMouseState().subscribe((otherId: string) => {
      if (this.userId !== otherId) {
        this.stopDrawingOther();
        this.otherUserName = "";
      } else {
        this.stopDrawing();
        this.mouseDown = false;
      }
    });
    this.board.getUndo().subscribe((id) => {
      if (id !== this.userId) { // the other wants to undo his work
        this.doUndoOther();
      }
    });
    this.board.getText().subscribe((text) => {
      if (text["userId"] !==  this.userId) {
        this.putText(text["text"].x, text["text"].y, false);
      }
    });
    this.board.getTextVal().subscribe((textVal) => {
      if (textVal["userId"] !== this.userId) {
        if (textVal["val"] === "Backspace") {
          const str: string = this.textInputs[textVal["id"]].innerHTML;
          this.textInputs[textVal["id"]].innerHTML = str.substr(0, str.length - 1);
        } else if (textVal["val"] === "Enter") {
          this.textInputs[textVal["id"]].innerHTML += "\n";
        } else if (textVal["val"].length === 1) {
          this.textInputs[textVal["id"]].innerHTML += textVal["val"];
        }
      }
    });
    this.board.getChangeRadius().subscribe((rad) => {
      console.log("radius changed");
      if (rad["userId"] !== this.userId) {
        if (rad["radius"]["type"] === "pencil") {
          this.setRadiusPencil(rad["radius"]["radius"]);
        } else {
          this.setRadiusEraser(rad["radius"]["radius"]);
        }
      }
    });
    this.shared.radiusPencil.subscribe(rad => {
      this.setRadiusPencil(rad);
      this.board.setChangeRadius({type: "pencil", radius: rad}, this.userId);
    });
    this.shared.radiusEraser.subscribe(rad => {
      this.setRadiusEraser(rad);
      this.board.setChangeRadius({type: "eraser", radius: rad}, this.userId);
    });
    this.shared.textSize.subscribe(rad => {
      this.setTextSize(rad);
    });
    this.shared.colorPencil.subscribe(col => {
      this.pencilInfo.color = col;
    });
    this.shared.colorText.subscribe(col => {
      this.colorText = col;
    });
    this.shared.saveBoard.subscribe((boardName: string) => {
      console.log("Hey I'm here" + boardName);
      if (boardName.length === 0) return;
      this.saveImage(boardName);
    });
    this.shared.imagePath.subscribe((ip: string) => {
      this.loadImage(ip);
    });
  }
  doResponsive() {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
  }
  changeTool(tool) {
    if (this.student) return;
    this.lastSelected = this.selectedTool;
    this.selectedTool = tool;
    if (this.selectedTool === "pencil") {
      this.doPencil();
    } else if (this.selectedTool === "eraser") {
      this.doErase();
    } else if (this.selectedTool === "text") {
      this.doText();
    } else if (this.selectedTool === "note") {
      this.doNote();
    } else if (this.selectedTool === "undo") {
      this.doUndo();
      this.selectedTool = this.lastSelected;
      this.board.sendUndo(this.userId);
    } else {
      this.doCamera();
      this.selectedTool = this.lastSelected;
    }
  }
  searchNote(target) {
    for (let i = 0; i < this.myNotes.length; i++) {
      if (this.myNotes[i] === target) {
        return this.myNotes[i];
      }
    }
    return null;
  }
  searchText(target) {
    for (let i = 0; i < this.textInputs.length; i++) {
      if (this.textInputs[i] === target) {
        return this.textInputs[i];
      }
    }
    return null;
  }
  setMouseToDown(e) {
    if (this.student) return;
    this.mouseDown = true;
    this.holder = this.searchText(e.target);
    if (this.holder != null) {
      return;
    }
    this.holder = this.searchNote(e.target);
    if (this.holder != null) {
        this.noteTime = true;
        this.beingDraggable(e);
        return;
    }
    this.deleteEmptyInputs();
    if (this.selectedTool === "pencil") {
      const arr = this.pointForCurrentPencil(e);
      this.pencilInfo.x = arr[0]; this.pencilInfo.y = arr[1];
      this.sendPoint(this.pencilInfo);
    } else if (this.selectedTool === "eraser") {
      const arr = this.pointForCurrentEraser(e);
      this.eraserInfo.x = arr[0]; this.eraserInfo.y = arr[1];
      this.sendPoint(this.eraserInfo);
    } else if (this.selectedTool === "text") {
      if (this.holder === null) {
        if (this.textInputs.length > 0) {
          this.textInputs[this.textInputs.length - 1].blur();
        }
        this.putText(e.clientX, e.clientY, true);
        this.textInputs[this.textInputs.length - 1].focus();
        this.board.sendText({x: e.clientX, y: e.clientY, val: e.value}, this.userId);
      }
    } else if (this.selectedTool === "note") {
      if (e.target === this.canvas.nativeElement) {
        this.putNote(e);
      }
    }
  }
  touchBegin(e) {
    if (this.student) return;
    e.preventDefault();
    this.mouseDown = true;
    this.holder = this.searchText(e.changedTouches["0"].target);
    if (this.holder != null) {
      return;
    }
    this.holder = this.searchNote(e.changedTouches["0"].target);
    if (this.holder != null) {
      this.noteTime = true;
      this.beingDraggable(e.changedTouches["0"]);
      return;
    }
    this.deleteEmptyInputs();
    if (this.selectedTool === "pencil") {
      const arr = this.pointForCurrentPencil(e.changedTouches["0"]);
      this.pencilInfo.x = arr[0]; this.pencilInfo.y = arr[1];
      this.sendPoint(this.pencilInfo);
    } else if (this.selectedTool === "eraser") {
      const arr = this.pointForCurrentEraser(e.changedTouches["0"]);
      this.eraserInfo.x = arr[0]; this.eraserInfo.y = arr[1];
      this.sendPoint(this.eraserInfo);
    } else if (this.selectedTool === "text") {
      if (this.holder === null) {
        if (this.textInputs.length > 0) {
          this.textInputs[this.textInputs.length - 1].blur();
        }
        this.putText(e.changedTouches["0"].clientX, e.changedTouches["0"].clientY, true);
        this.textInputs[this.textInputs.length - 1].focus();
        this.board.sendText({x: e.changedTouches["0"].clientX, y: e.changedTouches["0"].clientY, val: e.changedTouches["0"].value}, this.userId);
      }
    } else if (this.selectedTool === "note") {
      if (e.changedTouches["0"].target === this.canvas.nativeElement) {
        this.putNote(e.changedTouches["0"]);
      }
    }
  }
  setMouseToUp() {
    if (this.student) return;
    if (this.mouseDown === true) {
      this.mouseDown = false;
      this.board.sendMouseState(this.userId);
    }
  }
  sendPoint(point: {x: number, y: number, radius: number, color: string}) {
    this.board.sendPoint(point, this.selectedTool, this.userId, this.userName);
  }
  drawPoint(point: {x: number, y: number, radius: number, color: string}) {
    this.context.lineTo(point.x, point.y);
    this.context.closePath();
    this.context.fillStyle = point.color;
    this.context.strokeStyle = point.color;
    this.context.stroke();
    this.context.beginPath();
    this.context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    this.context.fill();
    this.context.beginPath();
    this.context.moveTo(point.x, point.y);
  }
  stopDrawing() {
    // this.context.beginPath();
    if (this.paths[this.paths.length - 1].length > 0) {
      this.paths.push([]);
    }
  }
  stopDrawingOther() {
    // this.context.beginPath();
    if (this.otherPaths[this.otherPaths.length - 1].length > 0) {
      this.otherPaths.push([]);
    }
  }
  putText(x: number, y: number, me: boolean) {
    this.textInputs.push(document.createElement("textarea"));
    this.textInputs[this.textInputs.length - 1].addEventListener("keydown", (e) => {
      console.log(e);
      for (let i = 0; i < this.textInputs.length; i++) {
        if (this.textInputs[i].getAttribute("id") === e.path[0].id) {
          this.board.sendTextVal(i, e.key, this.userId);
          return;
        }
      }
    });
    if (me) {
      // Save the text in paths
      if (this.paths == undefined || this.paths.length === 0) {
        this.paths.push([]);
      }
      this.paths[this.paths.length - 1].push({
        type: "text",
        color: this.colorText,
        size: this.textSize
      });
    } else {
      // Save the text in paths
      if (this.otherPaths == undefined || this.otherPaths.length === 0) {
        this.otherPaths.push([]);
      }
      this.otherPaths[this.otherPaths.length - 1].push({
        type: "text",
        color: this.colorText,
        size: this.textSize
      });
    }
    this.textInputs[this.textInputs.length - 1].style.display = "inline";
    this.textInputs[this.textInputs.length - 1].style.position = "absolute";
    this.textInputs[this.textInputs.length - 1].style.left = String(x) + "px";
    this.textInputs[this.textInputs.length - 1].style.top = String(y - 8) + "px";
    this.textInputs[this.textInputs.length - 1].style.border = "0px";
    this.textInputs[this.textInputs.length - 1].style.outline = "none";
    this.textInputs[this.textInputs.length - 1].style.backgroundColor = "rgba(0,0,0,0)";
    this.textInputs[this.textInputs.length - 1].style.color = this.colorText;
    this.textInputs[this.textInputs.length - 1].style.fontSize = String(this.textSize) + "px";

    this.textInputs[this.textInputs.length - 1].setAttribute("id", "text_" + String(this.textInputs.length - 1));
    this.textInputs[this.textInputs.length - 1].setAttribute("placeholder", "Type here");

    this.textContainer.nativeElement.appendChild(this.textInputs[this.textInputs.length - 1]);
  }
  putNote(e) {
    const div = document.createElement("div");
    div.classList.add("note");
    div.style.left = String(e.clientX) + "px";
    div.style.top = String(e.clientY) + "px";

    const textArea = document.createElement("textArea");
    textArea.setAttribute("cols", "20");
    textArea.setAttribute("rows", "10");
    textArea.setAttribute("autofocus", "true");
    textArea.addEventListener("keypress", DrawingAreaComponent.getKeyPressed);

    div.appendChild(textArea);
    this.myNotes.push(div);
    // this.paths[this.paths.length - 1].push({
    //   type: "note",
    //   color: this.colorNote
    // });
    this.noteContainer.nativeElement.appendChild(div);
  }
  pointForCurrentPencil(e) {
    let res: number[];
    res = [e.clientX, e.clientY + 15];
    return res;
  }
  pointForCurrentEraser(e) {
    return [e.clientX, e.clientY];
  }
  handleCanvasClicking(e) {
    if (this.noteTime) {
      this.beginDragging(e);
    } else if (this.mouseDown) {
      this.setMouseToDown(e);
      // this.putPoint(e);
    }
  }
  handleCanvasTouching(e) {
    e.preventDefault();
    if (this.noteTime) {
      this.beginDragging(e.changedTouches["0"]);
    } else if (this.mouseDown) {
      this.setMouseToDown(e.changedTouches["0"]);
    }
  }
  deleteEmptyInputs() {
    if (!this.textInputs || !this.textInputs.length) { return; }
    if (!this.textInputs[this.textInputs.length - 1].value) {
      this.textContainer.nativeElement.removeChild(this.textInputs.pop());
    }
  }
  setPencilImage(val) {
    if (val <= 2) {
      if (!this.canvas.nativeElement.classList.contains("draw-16")) {
        this.canvas.nativeElement.classList.add("draw-16");
      }
      this.canvas.nativeElement.classList.remove("draw-24");
      this.canvas.nativeElement.classList.remove("draw-32");
      this.canvas.nativeElement.classList.remove("draw-64");
      this.canvas.nativeElement.classList.remove("draw-128");
    } else if (val <= 4) {
      if (!this.canvas.nativeElement.classList.contains("draw-24")) {
        this.canvas.nativeElement.classList.add("draw-24");
      }
      this.canvas.nativeElement.classList.remove("draw-16");
      this.canvas.nativeElement.classList.remove("draw-32");
      this.canvas.nativeElement.classList.remove("draw-64");
      this.canvas.nativeElement.classList.remove("draw-128");
    } else if (val <= 6) {
      if (!this.canvas.nativeElement.classList.contains("draw-32")) {
        this.canvas.nativeElement.classList.add("draw-32");
      }
      this.canvas.nativeElement.classList.remove("draw-16");
      this.canvas.nativeElement.classList.remove("draw-24");
      this.canvas.nativeElement.classList.remove("draw-64");
      this.canvas.nativeElement.classList.remove("draw-128");
    } else if (val <= 8) {
      if (!this.canvas.nativeElement.classList.contains("draw-64")) {
        this.canvas.nativeElement.classList.add("draw-64");
      }
      this.canvas.nativeElement.classList.remove("draw-16");
      this.canvas.nativeElement.classList.remove("draw-24");
      this.canvas.nativeElement.classList.remove("draw-32");
      this.canvas.nativeElement.classList.remove("draw-128");
    } else {
      if (!this.canvas.nativeElement.classList.contains("draw-128")) {
        this.canvas.nativeElement.classList.add("draw-128");
      }
      this.canvas.nativeElement.classList.remove("draw-16");
      this.canvas.nativeElement.classList.remove("draw-24");
      this.canvas.nativeElement.classList.remove("draw-32");
      this.canvas.nativeElement.classList.remove("draw-64");
    }
  }
  setEraserImage(val) {
    if (val <= 2) {
      if (!this.canvas.nativeElement.classList.contains("circle-16")) {
        this.canvas.nativeElement.classList.add("circle-16");
      }
      this.canvas.nativeElement.classList.remove("circle-24");
      this.canvas.nativeElement.classList.remove("circle-32");
      this.canvas.nativeElement.classList.remove("circle-64");
      this.canvas.nativeElement.classList.remove("circle-128");
    } else if (val <= 4) {
      if (!this.canvas.nativeElement.classList.contains("circle-24")) {
        this.canvas.nativeElement.classList.add("circle-24");
      }
      this.canvas.nativeElement.classList.remove("circle-16");
      this.canvas.nativeElement.classList.remove("circle-32");
      this.canvas.nativeElement.classList.remove("circle-64");
      this.canvas.nativeElement.classList.remove("circle-128");
    } else if (val <= 6) {
      if (!this.canvas.nativeElement.classList.contains("circle-32")) {
        this.canvas.nativeElement.classList.add("circle-32");
      }
      this.canvas.nativeElement.classList.remove("circle-16");
      this.canvas.nativeElement.classList.remove("circle-24");
      this.canvas.nativeElement.classList.remove("circle-64");
      this.canvas.nativeElement.classList.remove("circle-128");
    } else if (val <= 8) {
      if (!this.canvas.nativeElement.classList.contains("circle-64")) {
        this.canvas.nativeElement.classList.add("circle-64");
      }
      this.canvas.nativeElement.classList.remove("circle-16");
      this.canvas.nativeElement.classList.remove("circle-24");
      this.canvas.nativeElement.classList.remove("circle-32");
      this.canvas.nativeElement.classList.remove("circle-128");
    } else {
      if (!this.canvas.nativeElement.classList.contains("circle-128")) {
        this.canvas.nativeElement.classList.add("circle-128");
      }
      this.canvas.nativeElement.classList.remove("circle-16");
      this.canvas.nativeElement.classList.remove("circle-24");
      this.canvas.nativeElement.classList.remove("circle-32");
      this.canvas.nativeElement.classList.remove("circle-64");
    }
  }
  removePencilImage() {
    this.canvas.nativeElement.classList.remove("draw-16");
    this.canvas.nativeElement.classList.remove("draw-24");
    this.canvas.nativeElement.classList.remove("draw-32");
    this.canvas.nativeElement.classList.remove("draw-64");
    this.canvas.nativeElement.classList.remove("draw-128");
  }
  removeEraserImage() {
    this.canvas.nativeElement.classList.remove("circle-16");
    this.canvas.nativeElement.classList.remove("circle-24");
    this.canvas.nativeElement.classList.remove("circle-32");
    this.canvas.nativeElement.classList.remove("circle-64");
    this.canvas.nativeElement.classList.remove("circle-128");
  }


  doPencil() {
    this.removeEraserImage();
    this.canvas.nativeElement.classList.remove("note-128");
    this.canvas.nativeElement.classList.remove("text-cursor");
    this.setPencilImage(this.pencilInfo.radius / 2);

    this.context.lineWidth = String(this.pencilInfo.radius * 2);
  }
  doErase() {
    this.removePencilImage();
    this.canvas.nativeElement.classList.remove("note-128");
    this.canvas.nativeElement.classList.remove("text-cursor");
    this.setEraserImage(this.eraserInfo.radius / 2);

    this.context.lineWidth = this.eraserInfo.radius * 2;
    // value taken from the nav bar
    // this.colorEraser = this.radColorEraser.nativeElement.value;
  }
  doText() {
    // value taken from the nav bar
    // this.colorText = this.radColorText.nativeElement.value;
    this.removeEraserImage();
    this.removePencilImage();
    this.canvas.nativeElement.classList.remove("note-128");
    this.canvas.nativeElement.classList.add("text-cursor");
  }
  doNote() {
    // value taken from the nav bar
    // this.colorText = this.radColorText.nativeElement.value;
    this.removeEraserImage();
    this.removePencilImage();
    this.canvas.nativeElement.classList.remove("text-cursor");
    this.canvas.nativeElement.classList.add("note-128");
  }
  doUndo() {
    if (this.paths === undefined || !this.paths.length) { return; }
    while (this.paths.length > 1 && !this.paths[this.paths.length - 1].length) { this.paths.pop(); }

    if (this.paths === undefined || !this.paths.length ||
      this.paths[this.paths.length - 1].length === 0) { return; }

    if (this.paths[this.paths.length - 1][0].type === "text") {
      this.paths.pop();
      if (!this.textInputs || !this.textInputs.length) { return; }
      this.textContainer.nativeElement.removeChild(this.textInputs.pop());
      this.paths.push([]);
      return;
    }

    this.paths.pop();
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    for (let i = 0; i < this.paths.length; i++) {
      this.context.lineWidth = this.paths[i][0].radius * 2;
      for (let j = 0; j < this.paths[i].length; j++) {
        this.drawPoint(this.paths[i][j]);
      }
      this.context.beginPath();
    }
    for (let i = 0; i < this.otherPaths.length; i++) {
      if  (this.otherPaths[i].length === 0 || this.otherPaths[i][0] === undefined) break;
      this.context.lineWidth = this.otherPaths[i][0].radius * 2;
      for (let j = 0; j < this.otherPaths[i].length; j++) {
        this.drawPoint(this.otherPaths[i][j]);
      }
      this.context.beginPath();
    }
    this.paths.push([]);
  }
  doUndoOther() {
    if (this.otherPaths === undefined || !this.otherPaths.length) { return; }
    while (this.otherPaths.length > 1 && !this.otherPaths[this.otherPaths.length - 1].length) { this.otherPaths.pop(); }

    if (this.otherPaths === undefined || !this.otherPaths.length ||
      this.otherPaths[this.otherPaths.length - 1].length === 0) { return; }

    if (this.otherPaths[this.otherPaths.length - 1][0].type === "text") {
      this.otherPaths.pop();
      if (!this.textInputs || !this.textInputs.length) { return; }
      this.textContainer.nativeElement.removeChild(this.textInputs.pop());
      this.otherPaths.push([]);
      return;
    }

    this.otherPaths.pop();
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    for (let i = 0; i < this.otherPaths.length; i++) {
      this.context.lineWidth = this.otherPaths[i][0].radius * 2;
      for (let j = 0; j < this.otherPaths[i].length; j++) {
        this.drawPoint(this.otherPaths[i][j]);
      }
      this.context.beginPath();
    }
    for (let i = 0; i < this.paths.length; i++) {
      if  (this.paths[i].length === 0 || this.paths[i][0] === undefined) break;
      this.context.lineWidth = this.paths[i][0].radius * 2;
      for (let j = 0; j < this.paths[i].length; j++) {
        this.drawPoint(this.paths[i][j]);
      }
      this.context.beginPath();
    }
    this.otherPaths.push([]);
    console.log(this.otherPaths);
    console.log(this.paths);
  }
  doCamera() {
    this.removeEraserImage();
    this.removePencilImage();

    this.downloadImage.nativeElement.href = this.canvas.nativeElement.toDataURL();
    this.downloadImage.nativeElement.download = "true";
    this.downloadImage.nativeElement.click();
  }

  saveImage(boardName) {
    let savedImage = this.canvas.nativeElement.toDataURL();
    // TODO Save board to backend
    this.getService.saveNewRoom(this.boardId, savedImage).subscribe(val => {
      console.log(val + ".." + boardName);
    });
  }

  loadImage(imageP) {
    //Loading of the home test image - img1
    let img = new Image();

    img.setAttribute('crossOrigin', 'anonymous'); // works for me
    //drawing of the test image - img1
    img.onload = () => {
      //draw background image
      this.context.drawImage(img, 0, 0);
    };

    img.src = 'http://localhost:3000/public/savedBoards/' + imageP;
  }


  setRadiusPencil(radius) {
    console.log(radius);
    // get value from the nav bar component
    this.pencilInfo.radius = radius;
    this.context.lineWidth = this.pencilInfo.radius * 2;
  }
  setRadiusEraser(radius) {
    // get value from the nav bar component
    this.eraserInfo.radius = radius;
    this.context.lineWidth = this.eraserInfo.radius * 2;
  }
  setTextSize(size) {
    this.textSize = size;
  }

  beingDraggable(e) {
    this.mouseStart = {x: e.clientX, y: e.clientY};
  }
  beginDragging(e) {
    if (this.mouseDown) {
      const s = this.holder.getAttribute("style");
      let tmp = "", i = 5;
      while (s[i] !== "p") {
        tmp += s[i++];
      }
      this.holder.style.left = String(e.clientX - this.mouseStart.x + Number(tmp)) + "px";
      i = s.indexOf("top: ") + 5; tmp = "";
      while (s[i] !== "p") {
        tmp += s[i++];
      }
      this.holder.style.top = String(e.clientY - this.mouseStart.y + Number(tmp)) + "px";
      this.mouseStart.x = e.clientX;
      this.mouseStart.y = e.clientY;
    }
  }
}
