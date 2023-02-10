import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { filesize } from 'filesize';
import { TranslationModule } from '../../translation/translation.module';
import { FileIconModule } from '../file-icon/file-icon.module';

@Component({
  selector: 'app-attachment-editor',
  templateUrl: './attachment-editor.component.html',
  styleUrls: ['./attachment-editor.component.scss'],
})
export class AttachmentEditorComponent {
  constructor(
    public translationModule: TranslationModule,
    private fileIconModule: FileIconModule
  ) {}

  @Input() createNew: boolean = false;
  @Input() fileObject!: File;
  public fileIconClass: string = 'fiv-icon-blank';
  public uploadPercentage: number = 0;
  public isUploading: boolean = false;
  public readableFileSize: any = '';

  async ngOnInit() {
    this.readableFileSize = filesize(this.fileObject.size, { bits: false });
    let fileExtension = this.fileObject.name.split('.').pop();
    if (!fileExtension) return;
    this.fileIconClass = await this.fileIconModule.getFileIconClass(
      fileExtension
    );
  }
}
