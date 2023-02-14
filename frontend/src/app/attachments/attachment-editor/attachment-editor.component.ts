import { Component, Input, EventEmitter, Output } from '@angular/core';
import { filesize } from 'filesize';
import { TranslationModule } from '../../translation/translation.module';
import { FileIconModule } from '../file-icon/file-icon.module';
import { AttachmentModule } from '../../api/attachments/attachments.module';
import { RepositoriesModule } from '../../api/repositories/repositories.module';
import { AttachmentData } from '../../../../../backend/lib/objects/repositories.types';

@Component({
  selector: 'app-attachment-editor',
  templateUrl: './attachment-editor.component.html',
  styleUrls: ['./attachment-editor.component.scss'],
})
export class AttachmentEditorComponent {
  constructor(
    public translationModule: TranslationModule,
    private fileIconModule: FileIconModule,
    private attachmentModule: AttachmentModule,
    private repositoriesModule: RepositoriesModule
  ) {}

  @Input() createNew: boolean = false;
  @Input() fileObject!: File;

  public fileIconClass: string = 'fiv-icon-blank';
  public uploadPercentage: number = 0;
  public isUploading: boolean = false;
  public readableFileSize: any = '';
  public round = Math.round; // This is used in the template
  public attachmentCategoryChoices: { [key: string]: string } = {};

  @Output() attachmentDataChange = new EventEmitter<AttachmentData>();
  public attachmentData: AttachmentData = {
    attachmentCategory: '',
    name: '',
    uploadID: '',
    uploadFinished: false,
    mimeType: '',
    fileExtension: '',
  };

  private getAttachmentCategories = async () => {
    this.attachmentCategoryChoices = {};
    this.attachmentData.attachmentCategory = '';
    let categories =
      await this.repositoriesModule.getRepositoryAttachmentCategories();
    for (let category of categories) {
      if (this.attachmentData.attachmentCategory == '')
        this.attachmentData.attachmentCategory = category.id.toString();
      this.attachmentCategoryChoices[category.id.toString()] = category.name;
    }
    this.propagateAttachmentDataChange();
  };

  public propagateAttachmentDataChange() {
    this.attachmentDataChange.emit(this.attachmentData);
  }

  async ngOnInit() {
    this.readableFileSize = filesize(this.fileObject.size, { bits: false });
    let fileExtension = this.fileObject.name.split('.').pop();
    if (!fileExtension) return;
    this.fileIconClass = await this.fileIconModule.getFileIconClass(
      fileExtension
    );
    this.getAttachmentCategories();
    this.upload();
    this.repositoriesModule.addRepositoryUpdateCallback(
      this.getAttachmentCategories
    );
    this.attachmentData.fileExtension =
      this.fileObject.name.split('.').pop() ?? '';
    this.propagateAttachmentDataChange();
  }

  public async upload() {
    this.attachmentData.mimeType = this.fileObject.type;
    this.attachmentData.uploadID = await this.attachmentModule.upload(
      this.fileObject,
      (progress) => {
        this.uploadPercentage = (progress.loaded / progress.total) * 100;
        if (this.uploadPercentage == 100) {
          this.attachmentData.uploadFinished = true;
          this.propagateAttachmentDataChange();
        }
      }
    );
    this.propagateAttachmentDataChange();
  }
}
