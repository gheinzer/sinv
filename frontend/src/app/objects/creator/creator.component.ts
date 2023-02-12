import { Component } from '@angular/core';
import { AttachmentModule } from '../../api/attachments/attachments.module';
import { RepositoriesModule } from '../../api/repositories/repositories.module';
import { LoaderModule } from '../../loader/loader.module';

@Component({
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
})
export class ObjectCreatorComponet {
  public categoryChoices: { [key: string]: string } = {};
  public objectCategory: string = '';

  constructor(
    public AttachmentModule: AttachmentModule,
    private repositoriesModule: RepositoriesModule,
    private loaderModule: LoaderModule
  ) {}

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

  ngOnInit() {
    this.updateCategories();
    this.repositoriesModule.addRepositoryUpdateCallback(this.updateCategories);
  }
}
