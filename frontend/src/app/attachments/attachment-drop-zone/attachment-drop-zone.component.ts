import { AttachmentData } from '../../../../../backend/lib/objects/repositories.types';
import {
  Component,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

export interface AttachmentsInformation {
  attachmentData: AttachmentData[];
  uploadsFinished: boolean;
}

@Component({
  selector: 'app-attachment-drop-zone',
  templateUrl: './attachment-drop-zone.component.html',
  styleUrls: ['./attachment-drop-zone.component.scss'],
})
export class AttachmentDropZoneComponent {
  public attachments: File[] = [];
  public dragover = false;
  private attachmentData: { [key: string]: AttachmentData } = {};
  @Output() attachmentDataChange = new EventEmitter<AttachmentsInformation>();

  public dropHandler(event: DragEvent) {
    event.preventDefault();
    this.dragover = false;

    if (!event.dataTransfer) return;
    if (!event.dataTransfer.files) return;
    if (event.dataTransfer.files.length == 0) return;

    let uploadedFiles = [];
    //@ts-ignore
    for (let file of [...event.dataTransfer.files]) {
      if (file.size > 0) this.attachments.push(file);
    }
  }

  private uploadsFinished() {
    for (let attachment of Object.values(this.attachmentData)) {
      if (!attachment.uploadFinished) {
        return false;
      }
    }
    return true;
  }

  public updateAttachmentData(data: AttachmentData) {
    if (data.uploadID == '') {
      return;
    }
    this.attachmentData[data.uploadID] = data;
    this.attachmentDataChange.emit({
      attachmentData: Object.values(this.attachmentData),
      uploadsFinished: this.uploadsFinished(),
    });
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  public addFile() {
    for (let file of this.fileInput.nativeElement.files) {
      this.attachments.push(file);
    }
    this.fileInput.nativeElement.value = '';
  }
}
