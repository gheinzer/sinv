import { Component } from '@angular/core';
import { AttachmentModule } from '../../api/attachments/attachments.module';
import { RepositoriesModule } from '../../api/repositories/repositories.module';
import { LoaderModule } from '../../loader/loader.module';
import { AttachmentsInformation } from '../../attachments/attachment-drop-zone/attachment-drop-zone.component';
import { AuthModule } from '../../api/auth/auth.module';
import { Router } from '@angular/router';

@Component({
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
})
export class ObjectCreatorComponet {
  public categoryChoices: { [key: string]: string } = {};
  public objectCategory: string = '';
  public attachmentInformation: AttachmentsInformation = {
    uploadsFinished: true,
    attachmentData: [],
  };
  public submitDisabled: boolean = true;
  public identifier: string = '';
  public name: string = '';
  public description: string = '';
  public creatingObject: boolean = false;
  public checkingSubmitState: boolean = false;
  public identifierExists: boolean = false;

  constructor(
    public attachmentModule: AttachmentModule,
    private repositoriesModule: RepositoriesModule,
    private loaderModule: LoaderModule,
    private authModule: AuthModule,
    private router: Router
  ) {
    authModule.redirectIfNotLoggedIn('/login');
  }

  public updateCategories = async () => {
    this.loaderModule.addRequirement();
    this.categoryChoices = {};
    this.objectCategory = '';
    let categories = await this.repositoriesModule.getRepositoryCategories();
    for (let category of categories) {
      if (this.objectCategory == '')
        this.objectCategory = category.id.toString();
      this.categoryChoices[category.id.toString()] = category.name;
    }
    this.loaderModule.satisfyRequirement();
  };
  public updateAttachmentInformation(ev: AttachmentsInformation) {
    this.attachmentInformation = ev;
    this.updateSubmitAbilityState();
  }

  public async updateSubmitAbilityState() {
    this.checkingSubmitState = true;
    let submitDisabled = false;
    this.identifierExists = await this.repositoriesModule.identifierExists(
      this.identifier
    );
    if (this.name == '') submitDisabled = true;
    else if (this.identifier == '') submitDisabled = true;
    else if (!this.attachmentInformation.uploadsFinished) submitDisabled = true;
    else if (this.identifierExists) {
      submitDisabled = true;
    }
    this.submitDisabled = submitDisabled;
    this.checkingSubmitState = false;
  }

  public async createObject() {
    if (this.submitDisabled || this.checkingSubmitState) return;
    if (this.creatingObject) return;
    this.creatingObject = true;
    let description = this.description.replaceAll('\n', '\\n');
    await this.repositoriesModule.createObject(
      this.identifier,
      this.name,
      parseInt(this.objectCategory),
      description,
      this.attachmentInformation.attachmentData
    );
    this.router.navigateByUrl('/object/view/' + this.identifier);
    this.creatingObject = false;
  }

  async ngOnInit() {
    await this.authModule.awaitAuthentication();
    this.updateCategories();
    this.repositoriesModule.addRepositoryUpdateCallback(this.updateCategories);
  }
}
