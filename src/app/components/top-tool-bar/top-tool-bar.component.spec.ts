import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopToolBarComponent } from './top-tool-bar.component';

describe('TopToolBarComponent', () => {
  let component: TopToolBarComponent;
  let fixture: ComponentFixture<TopToolBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopToolBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
