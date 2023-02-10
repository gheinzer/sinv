import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentEditorComponent } from './attachment-editor.component';

describe('AttachmentEditorComponent', () => {
  let component: AttachmentEditorComponent;
  let fixture: ComponentFixture<AttachmentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
