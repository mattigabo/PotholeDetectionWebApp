import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkersPopupComponent } from './markers-popup.component';

describe('MarkersPopupComponent', () => {
  let component: MarkersPopupComponent;
  let fixture: ComponentFixture<MarkersPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkersPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkersPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
