import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SavedBoardsComponent } from "./saved-boards.component";

describe("SavedBoardsComponent", () => {
  let component: SavedBoardsComponent;
  let fixture: ComponentFixture<SavedBoardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedBoardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
