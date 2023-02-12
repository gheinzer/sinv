import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from '../api/api.module';
import { AuthModule } from '../auth/auth.module';
import { LoaderModule } from '../../loader/loader.module';
import { InitializableClass } from '../../../../../backend/lib/types';

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
    this.loaderModule.addRequirement();
    await this.authModule.awaitAuthentication();
    let lastRepo = window.localStorage.getItem(this.lastRepoCookieName);
    if (this.authModule.isAuthenticated) {
      this.repositoryList = await this.getUserRepositories();
      for (let repo of this.repositoryList) {
        this.repositories[repo.id] = repo.name;
      }
    }
    this.loaderModule.satisfyRequirement();
    if (lastRepo) this.selectedRepository = parseInt(lastRepo);
    else this.selectedRepository = this.repositoryList[0].id;
    this.updateRepository();
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
    await this.awaitInitialization();
    return (
      await this.apiModule.call('repo/getTypes', {
        repositoryID: this.selectedRepository,
      })
    ).data.types;
  }

  public async changeCategoryName(id: number, newName: string) {
    await this.apiModule.call('repo/changeTypeName', {
      categoryID: id,
      name: newName,
      repositoryID: this.selectedRepository,
    });
    this.runRepositoryUpdateCallbacks();
  }

  public async deleteCategory(id: number) {
    await this.apiModule.call('repo/deleteType', {
      categoryID: id,
      repositoryID: this.selectedRepository,
    });
    this.runRepositoryUpdateCallbacks();
  }

  public async createCategory(name: string) {
    await this.apiModule.call('repo/createType', {
      name,
      repositoryID: this.selectedRepository,
    });
    this.runRepositoryUpdateCallbacks();
  }
}
