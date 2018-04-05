import {Component, OnInit, ViewChild, ElementRef, HostListener} from "@angular/core";
import {NavbarAndCanvasCommunicationService} from "../../services/navbar-and-canvas-communication.service";
import {WebSocketService} from "../../services/web-socket.service";

@Component({
  selector: "app-left-tool-bar",
  templateUrl: "./left-tool-bar.component.html",
  styleUrls: [
    "./left-tool-bar-mobile.component.css",
    "./left-tool-bar-tablet.component.css",
    "./left-tool-bar.component.css"
  ]
})
export class LeftToolBarComponent implements OnInit {


  @ViewChild("eraser") eraser: ElementRef;
  @ViewChild("pencil") pencil: ElementRef;
  @ViewChild("text") text: ElementRef;
  @ViewChild("note") note: ElementRef;
  @ViewChild("undo") undo: ElementRef;
  @ViewChild("camera") camera: ElementRef;

  @ViewChild("color1") radColorPencil: ElementRef;
  @ViewChild("color2") radColorEraser: ElementRef;
  @ViewChild("color3") radColorText: ElementRef;

  @ViewChild("pencilDiv") pencilDiv: ElementRef;
  @ViewChild("eraseDiv") eraserDiv: ElementRef;
  @ViewChild("textDiv") textDiv: ElementRef;

  @ViewChild("slider1") sliderPencil: ElementRef;
  @ViewChild("slider2") sliderEraser: ElementRef;
  @ViewChild("slider3") sliderText: ElementRef;

  @ViewChild("pencilContainer") pencilContainer: ElementRef;
  @ViewChild("eraserContainer") eraserContainer: ElementRef;
  @ViewChild("textContainer") textContainer: ElementRef;

  @ViewChild("container") container: ElementRef;
  @ViewChild("wholeWindow") wholeWindow: ElementRef;


  private selectedTool: string;
  private colorPencil = "#000000";
  private colorEraser = "#ffffff";
  private colorText = "#000000";
  private radiusPencil = 2;
  private radiusEraser = 2;
  private textSize = 10;
  private showLeftMenu = true;
  private showToolsButton = false;
  private nextVal = "block";
  constructor(private shared: NavbarAndCanvasCommunicationService,
              private ws: WebSocketService) {
  }
  ngOnInit() {
    this.doResponsive();
    this.shared.selectedTool.subscribe(tool => this.selectedTool = tool);

    this.shared.radiusPencil.subscribe(rad => this.radiusPencil = rad);
    this.shared.radiusEraser.subscribe(rad => this.radiusEraser = rad);
    this.shared.textSize.subscribe(rad => this.textSize = rad);

    this.shared.colorPencil.subscribe(col => this.colorPencil = col);
    this.shared.colorEraser.subscribe(col => this.colorEraser = col);
    this.shared.colorText.subscribe(col => this.colorText = col);


    // this.ws.getChangeRadius().subscribe(changes => {
    //   if (changes["text"]["type"] === "pencil") {
    //     this.radiusPencil = changes["text"]["radius"];
    //     this.shared.changeRadiusPencil(changes["text"]["radius"]);
    //   } else if (changes["text"]["type"] === "eraser") {
    //     this.radiusEraser = changes["text"]["radius"];
    //     this.shared.changeRadiusEraser(changes["text"]["radius"]);
    //   }
    // });
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.doResponsive();
  }

  doResponsive() {
    if (window.innerWidth <= 768) {
      this.showLeftMenu = false;
      this.showToolsButton = true;
      this.container.nativeElement.classList.add("left-menu-animation");
    } else {
      this.showLeftMenu = true;
      this.showToolsButton = false;
    }
  }
  updatePencilColor(e) {
    this.colorPencil = e.target.value;
    this.shared.changeColorPencil(this.colorPencil);
  }
  updateEraserColor(e) {
    this.colorEraser = e.target.value;
    this.shared.changeColorEraser(this.colorEraser);
  }
  updateTextColor(e) {
    this.colorText = e.target.value;
    this.shared.changeColorText(this.colorText);
  }

  setPencil() {
    this.shared.changeTool("pencil");
    this.eraser.nativeElement.classList.remove("selected");
    this.text.nativeElement.classList.remove("selected");
    this.camera.nativeElement.classList.remove("selected");
    this.undo.nativeElement.classList.remove("selected");
    this.note.nativeElement.classList.remove("selected");
    this.pencil.nativeElement.classList.add("selected");
    this.colorPencil = this.radColorPencil.nativeElement.value;
    this.showPencilRangeMenu();

  }
  setEraser() {
    this.shared.changeTool("eraser");
    this.pencil.nativeElement.classList.remove("selected");
    this.text.nativeElement.classList.remove("selected");
    this.camera.nativeElement.classList.remove("selected");
    this.undo.nativeElement.classList.remove("selected");
    this.note.nativeElement.classList.remove("selected");
    this.eraser.nativeElement.classList.add("selected");
    this.colorEraser = this.radColorEraser.nativeElement.value;
    this.showEraserRangeMenu();
  }
  setText() {
    this.shared.changeTool("text");
    this.eraser.nativeElement.classList.remove("selected");
    this.pencil.nativeElement.classList.remove("selected");
    this.camera.nativeElement.classList.remove("selected");
    this.undo.nativeElement.classList.remove("selected");
    this.note.nativeElement.classList.remove("selected");
    this.text.nativeElement.classList.add("selected");
    this.colorText = this.radColorText.nativeElement.value;
    this.shared.changeColorText(this.colorText);
    this.showTextRangeMenu();
  }
  setNote() {
    this.shared.changeTool("note");
    this.eraser.nativeElement.classList.remove("selected");
    this.pencil.nativeElement.classList.remove("selected");
    this.text.nativeElement.classList.remove("selected");
    this.undo.nativeElement.classList.remove("selected");
    this.camera.nativeElement.classList.remove("selected");
    this.note.nativeElement.classList.add("selected");
  }
  setUndo() {
    // notify the drawing area
    this.shared.changeTool("undo");
  }
  setCamera() {
    this.shared.changeTool("camera");
  }

  setRadiusPencil() {
    this.radiusPencil = Number(this.sliderPencil.nativeElement.value);
    // this.ws.setChangeRadius({type: "pencil", radius: this.radiusPencil});
    this.shared.changeRadiusPencil(this.radiusPencil);
    this.setPencil();
  }
  setRadiusEraser() {
    this.radiusEraser = Number(this.sliderEraser.nativeElement.value);
    // this.ws.setChangeRadius({type: "eraser", radius: this.radiusEraser});
    this.shared.changeRadiusEraser(this.radiusEraser);
    this.setEraser();
  }
  setTextSize() {
    this.textSize = Number(this.sliderText.nativeElement.value) * 10;
    console.log("text size", this.textSize);
    this.shared.changeTextSize(this.textSize);
    this.setText();
  }

  showPencilRangeMenu() {
    if (this.selectedTool === "pencil") {
      this.pencilContainer.nativeElement.style.display = "inline-block";
      this.eraserContainer.nativeElement.style.display = "none";
      this.textContainer.nativeElement.style.display = "none";
    }
  }
  showEraserRangeMenu() {
    if (this.selectedTool === "eraser") {
      this.eraserContainer.nativeElement.style.display = "inline-block";
      this.pencilContainer.nativeElement.style.display = "none";
      this.textContainer.nativeElement.style.display = "none";
    }
  }
  showTextRangeMenu() {
    if (this.selectedTool === "text") {
      this.textContainer.nativeElement.style.display = "inline-block";
      this.eraserContainer.nativeElement.style.display = "none";
      this.pencilContainer.nativeElement.style.display = "none";
    }
  }
  hidePencilRangeMenu() {
    this.pencilContainer.nativeElement.style.display = "none";
  }
  hideEraserRangeMenu() {
    this.eraserContainer.nativeElement.style.display = "none";
  }
  hideTextRangeMenu() {
    this.textContainer.nativeElement.style.display = "none";
  }
  toggleLeftMenu() {
    this.wholeWindow.nativeElement.style.display = this.nextVal;
    if (this.nextVal === "block") { this.nextVal = "none"; } else { this.nextVal = "block"; }
    this.showLeftMenu = !this.showLeftMenu;
  }

}
