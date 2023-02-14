import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentDropZoneComponent } from './attachment-drop-zone.component';

describe('AttachmentDropZoneComponent', () => {
  let component: AttachmentDropZoneComponent;
  let fixture: ComponentFixture<AttachmentDropZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentDropZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentDropZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
