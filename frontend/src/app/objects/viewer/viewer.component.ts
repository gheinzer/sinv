import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderModule } from '../../loader/loader.module';
import { RepositoriesModule } from '../../api/repositories/repositories.module';
import { ObjectProperties } from '../../../../../backend/lib/objects/repositories.types';
import { AttachmentModule } from '../../api/attachments/attachments.module';
import { FileIconModule } from '../../attachments/file-icon/file-icon.module';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ObjectViewerComponent {
  public objectIdentifier: string = '';
  public objectData!: ObjectProperties;

  constructor(
    activatedRoute: ActivatedRoute,
    private loaderModule: LoaderModule,
    private repositoriesModule: RepositoriesModule,
    public fileIconModule: FileIconModule,
    private attachmentModule: AttachmentModule
  ) {
    activatedRoute.params.subscribe((val) => {
      if (val['objectIdentifier']) {
        this.objectIdentifier = val['objectIdentifier'];
        this.init();
      }
    });
  }

  private async init() {
    this.loaderModule.addRequirement();
    this.objectData = await this.repositoriesModule.getObjectData(
      this.objectIdentifier
    );
    for (let attachment of this.objectData.attachments) {
      attachment.fileIconClass = await this.fileIconModule.getFileIconClass(
        attachment.extension
      );
    }
    this.objectData.description = this.objectData.description.replaceAll(
      '\\n',
      '<br>'
    );
    this.loaderModule.satisfyRequirement();
  }

  public async downloadAttachment(id: number) {
    this.attachmentModule.downloadFile(id);
  }
}
