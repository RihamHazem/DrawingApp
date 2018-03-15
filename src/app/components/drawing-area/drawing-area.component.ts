import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NavbarAndCanvasCommunicationService } from "../../services/navbar-and-canvas-communication.service";
import {ChatService} from "../../services/chat.service";
import {WebSocketService} from "../../services/web-socket.service";

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
    type: "pencil",
    radius: 2,
    x: 0,
    y: 0,
    color: "#000000"
  };
  private eraserInfo = {
    type: "eraser",
    radius: 2,
    x: 0,
    y: 0,
    color: "#ffffff"
  };
  private radiusEraser = 2; //*
  private textInputs = [];
  private context: any;
  private colorEraser = "#ffffff"; //*
  private colorText = "#000000";
  private colorNote = "rgb(255, 247, 205)";
  private paths: any;
  private textSize: any;
  private addRes = 0;
  private noteTime = false;
  private myNotes = [];
  private holder: any = null;
  private mouseStart: {x: number, y: number} = {
    x: 0,
    y: 0
  };

  @ViewChild("myCanvas") canvas: ElementRef;
  @ViewChild("textInputs") textContainer: ElementRef;
  @ViewChild("notes") noteContainer: ElementRef;
  @ViewChild("downloadImage") downloadImage: ElementRef;

  constructor(private shared: NavbarAndCanvasCommunicationService,
              private chat: WebSocketService) {
    this.paths = [[]];
  }
  // ***** Static Functions Begin ***** //
  static checkPressingEnter(e) {
    event.preventDefault();
    if (e.keyCode === 13) {
    }
  }
  static getKeyPressed(e) {
    if (e.key === "Enter") {
      DrawingAreaComponent.curRow += 1;
      if (DrawingAreaComponent.curRow === e.target.rows) {
        e.target.rows++;
        console.log("Hey");
      }
    }
  }
  // ***** Static Functions End ***** //

  ngOnInit() {
    this.doResponsive();
    this.context = this.canvas.nativeElement.getContext("2d");
    this.context.lineWidth = this.pencilInfo.radius * 2;
    this.shared.selectedTool.subscribe(tool => this.changeTool(tool));
    this.chat.getMessage().subscribe(pencilPoint => {
      console.log(pencilPoint);
      this.pencilInfo = pencilPoint["text"];
      if(this.mouseDown === false) { // it's not my turn so I should update drawing
        this.drawPoint(this.pencilInfo.x, this.pencilInfo.y, this.pencilInfo.radius, this.pencilInfo.color);
        // this.context.beginPath();
      }
    });
    this.chat.getMouseState().subscribe(isDown => {
      // if(isDown === false) {
        this.context.beginPath();
      // }
    });
    this.shared.radiusPencil.subscribe(rad => {
      this.setRadiusPencil(rad);
    });
    this.shared.radiusEraser.subscribe(rad => {
      this.setRadiusEraser(rad);
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
  }

  // @HostListener('window:resize', ['$event'])
  // onResize() {
  //   this.doResponsive();
  //   this.changeTool(this.selectedTool);
  // }

  doResponsive() {
    if (window.innerWidth <= 768) {
      console.log(window.innerWidth);
      this.canvas.nativeElement.width = window.innerWidth - 10;
      this.canvas.nativeElement.height = window.innerHeight - 80;
      this.canvas.nativeElement.style.marginLeft = "5px";
      this.canvas.nativeElement.style.marginTop = "7px";
      this.addRes = 79;
    } else {
      this.canvas.nativeElement.width = window.innerWidth - 100;
      this.canvas.nativeElement.height = window.innerHeight - 80;
      this.canvas.nativeElement.style.marginLeft = "85px";
      this.addRes = 0;
    }
  }

  changeTool(tool) {
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
  setMouseToDown(e) {
    this.mouseDown = true;
    this.holder = this.searchNote(e.target);
    if (this.holder != null) {
      this.noteTime = true;
      this.beingDraggable(e);
    } else if (this.selectedTool === "text") {
      if (this.textInputs.length > 0) {
        this.textInputs[this.textInputs.length - 1].blur();
      }
      this.putText(e);
      this.textInputs[this.textInputs.length - 1].focus();
    } else if (this.selectedTool === "pencil" || this.selectedTool === "eraser") {
      this.putPoint(e);
    } else if (this.selectedTool === "note") {
      if (e.target === this.canvas.nativeElement) {
        this.putNote(e);
      }
    }
  }
  touchBegin(e) {
    e.preventDefault();
    this.mouseDown = true;
    this.holder = this.searchNote(e.changedTouches["0"].target);
    if (this.holder != null) {
      this.noteTime = true;
      this.beingDraggable(e.changedTouches["0"]);
    } else if (this.selectedTool === "text") {
      if (this.textInputs.length > 0) {
        this.textInputs[this.textInputs.length - 1].blur();
      }
      this.putText(e.changedTouches["0"]);
      this.textInputs[this.textInputs.length - 1].focus();
    } else if (this.selectedTool === "pencil" || this.selectedTool === "eraser") {
      this.putPoint(e.changedTouches["0"]);
    } else if (this.selectedTool === "note") {
      if (e.changedTouches["0"].target === this.canvas.nativeElement) {
        this.putNote(e.changedTouches["0"]);
      }
    }
  }
  setMouseToUp() {
    if (this.mouseDown === true) {
      this.mouseDown = false;
      this.chat.sendMouseState(this.mouseDown);
      this.noteTime = false;
      this.context.beginPath();
      this.paths.push([]);
    }
  }

  putText(e) {
    this.deleteEmptyInputs();
    this.textInputs.push(document.createElement("textarea"));

    // Save the text in paths
    this.paths[this.paths.length - 1].push({
      type: "text",
      color: this.colorText,
      size: this.textSize
    });

    this.textInputs[this.textInputs.length - 1].style.display = "inline";
    this.textInputs[this.textInputs.length - 1].style.position = "absolute";
    this.textInputs[this.textInputs.length - 1].style.left = String(e.clientX) + "px";
    this.textInputs[this.textInputs.length - 1].style.top = String(e.clientY - 8) + "px";
    this.textInputs[this.textInputs.length - 1].style.border = "0px";

    this.textInputs[this.textInputs.length - 1].style.outline = "none";
    this.textInputs[this.textInputs.length - 1].style.backgroundColor = "rgba(0,0,0,0)";
    this.textInputs[this.textInputs.length - 1].style.color = this.colorText;
    this.textInputs[this.textInputs.length - 1].style.fontSize = String(this.textSize) + "px";

    this.textInputs[this.textInputs.length - 1].setAttribute("placeholder", "Type here");
    this.textInputs[this.textInputs.length - 1].addEventListener("onkeydown", DrawingAreaComponent.checkPressingEnter(e));

    this.textContainer.nativeElement.appendChild(this.textInputs[this.textInputs.length - 1]);
  }
  putNote(e) {
    const div = document.createElement("div");
    div.classList.add("note");
    div.setAttribute("_ngcontent-c4", "");
    div.style.left = String(e.clientX) + "px";
    div.style.top = String(e.clientY) + "px";

    const textArea = document.createElement("textArea");
    textArea.setAttribute("cols", "20");
    textArea.setAttribute("rows", "10");
    textArea.setAttribute("autofocus", "true");
    textArea.setAttribute("_ngcontent-c4", "");
    textArea.addEventListener("keypress", DrawingAreaComponent.getKeyPressed);

    div.appendChild(textArea);
    this.myNotes.push(div);
    this.paths[this.paths.length - 1].push({
      type: "note",
      color: this.colorNote
    });
    this.noteContainer.nativeElement.appendChild(div);
  }
  pointForCurrentPencil(e) {
    const val = this.pencilInfo.radius / 2;
    let res: number[];
    if (val <= 2) {
      res = [e.clientX - 85 + this.addRes, e.clientY - 55];
    } else if (val <= 4) {
      res = [e.clientX - 85 + this.addRes, e.clientY - 49];
    } else if (val <= 6) {
      res = [e.clientX - 85 + this.addRes, e.clientY - 42];
    } else if (val <= 8) {
      res = [e.clientX - 80 + this.addRes, e.clientY - 12];
    } else {
      res = [e.clientX - 80 + this.addRes, e.clientY - 10];
    }
    return res;
  }
  pointForCurrentEraser(e) {
    return [e.clientX - 85 + this.addRes, e.clientY - 70];
  }
  handleCanvasClicking(e) {
    if (this.noteTime) {
      this.beginDragging(e);
    } else {
      this.putPoint(e);
    }
  }
  handleCanvasTouching(e) {
    e.preventDefault();
    if (this.noteTime) {
      this.beginDragging(e.changedTouches["0"]);
    } else {
      this.putPoint(e.changedTouches["0"]);
    }
  }
  putPoint(e) {
    if (this.mouseDown) {
      if (this.selectedTool === "pencil") {
        const arr = this.pointForCurrentPencil(e);
        this.pencilInfo.x = arr[0];
        this.pencilInfo.y = arr[1];
        // Draw the point on the screen
        this.drawPoint(this.pencilInfo.x, this.pencilInfo.y, this.pencilInfo.radius, this.pencilInfo.color);
        // Save the path of the drawing
        this.paths[this.paths.length - 1].push(this.pencilInfo);
        this.chat.sendMessage(this.pencilInfo);
      } else if (this.selectedTool === "eraser") {
        const arr = this.pointForCurrentEraser(e);
        this.eraserInfo.x = arr[0];
        this.eraserInfo.y = arr[1];
        // Draw the point on the screen
        this.drawPoint(this.eraserInfo.x, this.eraserInfo.y, this.eraserInfo.radius, this.eraserInfo.color);
        // Save the path of the eraser
        this.paths[this.paths.length - 1].push(this.eraserInfo);
      }
    }
  }
  drawPoint(x: number, y: number, radius: number, color: string) {
    this.context.lineTo(x, y);
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.strokeStyle = color;
    this.context.stroke();
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    this.context.fill();
    this.context.beginPath();
    this.context.moveTo(x, y);
  }
  deleteEmptyInputs() {
    console.log(this.textInputs);
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
    this.canvas.nativeElement.classList.remove("text-cursor");
    this.setPencilImage(this.pencilInfo.radius / 2);

    this.context.lineWidth = String(this.pencilInfo.radius * 2);
  }
  doErase() {
    this.removePencilImage();
    this.canvas.nativeElement.classList.remove("text-cursor");
    this.setEraserImage(this.radiusEraser / 2);

    this.context.lineWidth = String(this.radiusEraser * 2);
    // value taken from the nav bar
    // this.colorEraser = this.radColorEraser.nativeElement.value;
  }
  doText() {
    // value taken from the nav bar
    // this.colorText = this.radColorText.nativeElement.value;
    this.removeEraserImage();
    this.removePencilImage();
    this.canvas.nativeElement.classList.add("text-cursor");
  }
  doNote() {
    // value taken from the nav bar
    // this.colorText = this.radColorText.nativeElement.value;
    this.removeEraserImage();
    this.removePencilImage();
  }
  doUndo() {
    if (this.paths === undefined || !this.paths.length || !this.paths[0].length) { return; }
    if (!this.paths[this.paths.length - 1].length) { this.paths.pop(); }

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
        this.drawPoint(this.paths[i][j].x, this.paths[i][j].y, this.paths[i][j].radius, this.paths[i][j].color);
      }
      this.context.beginPath();
    }
    this.paths.push([]);
  }
  doCamera() {
    this.removeEraserImage();
    this.removePencilImage();

    this.downloadImage.nativeElement.href = this.canvas.nativeElement.toDataURL();
    this.downloadImage.nativeElement.download = "true";
    this.downloadImage.nativeElement.click();
  }


  setRadiusPencil(radius) {
    // get value from the nav bar component
    this.pencilInfo.radius = radius;
    this.context.lineWidth = String(this.pencilInfo.radius * 2);
  }
  setRadiusEraser(radius) {
    // get value from the nav bar component
    this.radiusEraser = radius;
    this.context.lineWidth = String(this.radiusEraser * 2);
  }
  setTextSize(size) {
    this.textSize = size;
  }

  beingDraggable(e) {
    console.log(e.currentTarget);
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
