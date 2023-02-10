import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-attachment-drop-zone',
  templateUrl: './attachment-drop-zone.component.html',
  styleUrls: ['./attachment-drop-zone.component.scss'],
})
export class AttachmentDropZoneComponent {
  public attachments: File[] = [];
  public dragover = false;

  public dropHandler(event: DragEvent) {
    event.preventDefault();
    this.dragover = false;

    if (!event.dataTransfer) return;
    if (!event.dataTransfer.files) return;
    if (event.dataTransfer.files.length == 0) return;

    let uploadedFiles = [];
    //@ts-ignore
    for (let file of [...event.dataTransfer.files]) {
      if (file.size == 0) continue;
      this.attachments.push(file);
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  public addFile() {
    for (let file of this.fileInput.nativeElement.files) {
      this.attachments.push(file);
    }
    this.fileInput.nativeElement.value = '';
  }
}
