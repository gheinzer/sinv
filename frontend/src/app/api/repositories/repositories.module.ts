import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from '../api/api.module';
import { AuthModule } from '../auth/auth.module';
import { LoaderModule } from '../../loader/loader.module';
import { InitializableClass } from '../../../../../backend/lib/types';
import {
  AttachmentData,
  ObjectProperties,
} from '../../../../../backend/lib/objects/repositories.types';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class RepositoriesModule extends InitializableClass {
  private repositoryList: { name: string; id: number }[] = [];
  public repositories: { [key: number]: string } = [];
  public selectedRepository: number = 0;
  private repositoryUpdateCallbacks: (() => void)[] = [];

  private readonly lastRepoCookieName: string = 'sinv-last-repo-id';

  constructor(
    private apiModule: APIModule,
    private authModule: AuthModule,
    private loaderModule: LoaderModule
  ) {
    super();
    this.init();
  }

  public addRepositoryUpdateCallback(callback: () => void) {
    this.repositoryUpdateCallbacks.push(callback);
  }

  private runRepositoryUpdateCallbacks() {
    for (let callback of this.repositoryUpdateCallbacks) {
      callback();
    }
  }

  private async init() {
    await this.authModule.awaitAuthentication();
    this.loaderModule.addRequirement();
    let lastRepo: string | number | null = window.localStorage.getItem(
      this.lastRepoCookieName
    );
    if (this.authModule.isAuthenticated) {
      this.repositoryList = await this.getUserRepositories();
      for (let repo of this.repositoryList) {
        this.repositories[repo.id] = repo.name;
      }
      this.loaderModule.satisfyRequirement();
      if (lastRepo) {
        lastRepo = parseInt(lastRepo);
        if (!this.repositories[lastRepo])
          lastRepo = this.selectedRepository = this.repositoryList[0].id;
        this.selectedRepository = lastRepo;
      } else this.selectedRepository = this.repositoryList[0].id;
      this.updateRepository();
    }
    this.markAsInitialized();
    this.runRepositoryUpdateCallbacks();
  }

  public async changeRepository(id: number | string) {
    id = parseInt(id.toString());
    this.selectedRepository = id;
    this.updateRepository();
  }

  public async updateRepository() {
    let lastRepo = window.localStorage.getItem(this.lastRepoCookieName);

    window.localStorage.setItem(
      this.lastRepoCookieName,
      this.selectedRepository.toString()
    );
    this.runRepositoryUpdateCallbacks();
  }

  private async getUserRepositories(): Promise<{ name: string; id: number }[]> {
    await this.authModule.awaitAuthentication();
    let reponse = await this.apiModule.call('repo/getRepositories', {});
    return reponse.data.repositories;
  }

  public async getRepositoryCategories(): Promise<
    { name: string; id: number }[]
  > {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    return (
      await this.apiModule.call('repo/getTypes', {
        repositoryID: this.selectedRepository,
      })
    ).data.types;
  }

  public async getRepositoryAttachmentCategories(): Promise<
    { name: string; id: number }[]
  > {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    return (
      await this.apiModule.call('repo/getAttachmentTypes', {
        repositoryID: this.selectedRepository,
      })
    ).data.types;
  }

  public async changeCategoryName(id: number, newName: string) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    await this.apiModule.call('repo/changeTypeName', {
      categoryID: id,
      name: newName,
      repositoryID: this.selectedRepository,
    });
    this.runRepositoryUpdateCallbacks();
  }

  public async deleteCategory(id: number) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    await this.apiModule.call('repo/deleteType', {
      categoryID: id,
      repositoryID: this.selectedRepository,
    });
    this.runRepositoryUpdateCallbacks();
  }

  public async createCategory(name: string) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    await this.apiModule.call('repo/createType', {
      name,
      repositoryID: this.selectedRepository,
    });
    this.runRepositoryUpdateCallbacks();
  }

  public async changeAttachmentCategoryName(id: number, newName: string) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    await this.apiModule.call('repo/changeAttachmentTypeName', {
      categoryID: id,
      name: newName,
      repositoryID: this.selectedRepository,
    });
    this.runRepositoryUpdateCallbacks();
  }

  public async deleteAttachmentCategory(id: number) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    await this.apiModule.call('repo/deleteAttachmentType', {
      categoryID: id,
      repositoryID: this.selectedRepository,
    });
    this.runRepositoryUpdateCallbacks();
  }

  public async createAttachmentCategory(name: string) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    await this.apiModule.call('repo/createAttachmentType', {
      name,
      repositoryID: this.selectedRepository,
    });
    this.runRepositoryUpdateCallbacks();
  }

  public async createObject(
    identifier: string,
    name: string,
    category: number,
    description: string,
    attachments: AttachmentData[]
  ) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    await this.apiModule.call('repo/addObject', {
      name,
      repositoryID: this.selectedRepository,
      identifier,
      typeID: category,
      description,
      attachments,
    });
  }

  public async identifierExists(identifier: string) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    let result = await this.apiModule.call('repo/identifierExists', {
      identifier,
      repositoryID: this.selectedRepository,
    });
    return result.data.identifierExists;
  }

  public async getObjectData(identifier: string): Promise<ObjectProperties> {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    let result = await this.apiModule.call('repo/getObjectData', {
      identifier,
      repositoryID: this.selectedRepository,
    });
    return result.data.objectData;
  }

  public async getMaxIdentifierLength() {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    let result = await this.apiModule.call('repo/getMaxIdentifierLength', {
      repositoryID: this.selectedRepository,
    });
    return result.data.maxIdentifierLength;
  }

  public async textSearch(searchString: string) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    let result = await this.apiModule.call('repo/textSearch', {
      repositoryID: this.selectedRepository,
      searchString,
    });
    return result.data.results;
  }

  public async editRepository(
    newName: string,
    description: string,
    repositoryID: number
  ) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    await this.apiModule.call('repo/edit', {
      repositoryID,
      name: newName,
      description,
    });
    await this.init();
  }

  public async deleteRepository(repositoryID: number) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    await this.apiModule.call('repo/delete', {
      repositoryID,
    });
  }

  public async giveRepositoryPermission(userID: number, repositoryID: number) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    await this.apiModule.call('repo/givePermission', {
      userID,
      repositoryID,
    });
  }

  public async revokeRepositoryPermission(
    userID: number,
    repositoryID: number
  ) {
    await this.authModule.awaitAuthentication();
    await this.awaitInitialization();
    await this.apiModule.call('repo/revokePermission', {
      userID,
      repositoryID,
    });
  }

  public async getAllRepositories() {
    await this.authModule.awaitAuthentication();
    return (await this.apiModule.call('repo/getAllRepositories', {})).data
      .repositories;
  }

  public async createRepository(name: string, description: string) {
    await this.authModule.awaitAuthentication();
    await this.apiModule.call('repo/createRepository', { name, description });
  }
}
