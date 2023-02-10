import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class FileIconModule {
  private fetchedFileTypes: boolean = false;
  private initializationCallbacks: (() => void)[] = [];
  private fileTypes: string[] = [];

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.fileTypes = await (
      await fetch(
        'https://cdn.jsdelivr.net/npm/file-icon-vectors@1.0.0/dist/icons/vivid/catalog.json'
      )
    ).json();
    this.fetchedFileTypes = true;
    for (let callback of this.initializationCallbacks) {
      callback();
    }
  }

  private awaitInitialization() {
    if (this.fetchedFileTypes) return;
    return new Promise<void>((resolve, reject) => {
      this.initializationCallbacks.push(resolve);
    });
  }

  public async getFileIconClass(fileExtension: string) {
    fileExtension = fileExtension.toLowerCase();
    await this.awaitInitialization();
    if (this.fileTypes.includes(fileExtension))
      return 'fiv-icon-' + fileExtension;
    else return 'fiv-icon-blank';
  }
}
