import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class NavbarAndCanvasCommunicationService {

  private sharedSelectedTool = new BehaviorSubject<string>("pencil");
  private sharedRadiusPencil = new BehaviorSubject<number>(2);
  private sharedRadiusEraser = new BehaviorSubject<number>(2);
  private sharedRadiusText = new BehaviorSubject<number>(10);

  private sharedColorPencil = new BehaviorSubject<string>("#000");
  private sharedColorEraser = new BehaviorSubject<string>("#fff");
  private sharedColorText = new BehaviorSubject<string>("#000");
  public selectedTool = this.sharedSelectedTool.asObservable();

  public radiusPencil = this.sharedRadiusPencil.asObservable();
  public radiusEraser = this.sharedRadiusEraser.asObservable();
  public textSize = this.sharedRadiusText.asObservable();

  public colorPencil = this.sharedColorPencil.asObservable();
  public colorEraser = this.sharedColorEraser.asObservable();
  public colorText = this.sharedColorText.asObservable();
  constructor() { }

  changeTool(tool: string) {
    this.sharedSelectedTool.next(tool);
  }

  changeRadiusPencil(rad: number) {
    this.sharedRadiusPencil.next(rad);
  }
  changeRadiusEraser(rad: number) {
    this.sharedRadiusEraser.next(rad);
  }
  changeTextSize(rad: number) {
    this.sharedRadiusText.next(rad);
  }

  changeColorPencil(col: string) {
    this.sharedColorPencil.next(col);
  }
  changeColorEraser(col: string) {
    this.sharedColorEraser.next(col);
  }
  changeColorText(col: string) {
    this.sharedColorText.next(col);
  }
}
