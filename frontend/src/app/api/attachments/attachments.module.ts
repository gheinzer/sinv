import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from '../api/api.module';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class AttachmentModule {
  constructor(private APIModule: APIModule, private AuthModule: AuthModule) {}

  public async upload(
    uploadFile: File,
    progressCallback: (ev: ProgressEvent) => void
  ): Promise<string> {
    await this.AuthModule.awaitAuthentication();
    if (!this.AuthModule.authenticationData.sessionID)
      throw Error('Not authenticated');

    let xhr = new XMLHttpRequest();

    let formdata = new FormData();
    formdata.append('file', uploadFile, uploadFile.name);
    formdata.append('sessionID', this.AuthModule.authenticationData.sessionID);
    formdata.append('mimeType', uploadFile.type);

    let data = await this.APIModule.call('uploads/initializeUpload', {
      mimeType: uploadFile.type,
    });
    formdata.append('uploadID', data.data.uploadID);

    xhr.upload.addEventListener('progress', progressCallback);

    xhr.open('POST', '/upload');
    xhr.send(formdata);
    return data.data.uploadID;
  }
}
