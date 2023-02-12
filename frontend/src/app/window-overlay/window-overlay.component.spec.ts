import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowOverlayComponent } from './window-overlay.component';

describe('WindowOverlayComponent', () => {
  let component: WindowOverlayComponent;
  let fixture: ComponentFixture<WindowOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindowOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
