import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RightToolBarComponent } from "./left-tool-bar.component";

describe("RightToolBarComponent", () => {
  let component: RightToolBarComponent;
  let fixture: ComponentFixture<RightToolBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightToolBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
