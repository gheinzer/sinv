import { Component } from '@angular/core';
import { AttachmentModule } from '../../api/attachments/attachments.module';

@Component({
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
})
export class ObjectCreatorComponet {
  constructor(public AttachmentModule: AttachmentModule) {}

  public uploadFile() {
    console.log('hello');
    this.AttachmentModule.upload(
      document.getElementsByTagName('input')[4],
      console.log
    );
  }
}
