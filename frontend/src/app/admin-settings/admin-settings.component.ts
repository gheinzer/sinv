import { Component } from '@angular/core';
import { LoaderModule } from '../loader/loader.module';
import { AuthModule } from '../api/auth/auth.module';
import { RepositoriesModule } from '../api/repositories/repositories.module';
import { TranslationModule } from '../translation/translation.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
})
export class AdminSettingsComponent {
  public hasRepositoryAdminPermission: boolean = false;
  public hasUserAdminPermission: boolean = false;
  public cachedRepositories: any[] = [];
  public HTMLRepositories: any[] = [];
  public editedRepositories: any[] = [];
  public editingRepositoryID: number | null = null;
  public repositoryEditingError: 'name-empty' | 'name-exists' | null = null;
  public editingRepositoryPermissionID: number | null = null;
  public permissionUserSearchResults: any[] = [];
  public cachedUsers: any[] = [];
  public permissionUserSearchString: string = '';
  private modifingUserPermissions: boolean = false;
  public showAddRepositoryOverlay: boolean = false;
  public newRepositoryName: string = '';
  public newRepositoryDescription: string = '';
  private creatingRepository: boolean = false;

  constructor(
    private loaderModule: LoaderModule,
    private authModule: AuthModule,
    public repositoriesModule: RepositoriesModule,
    public translationModule: TranslationModule
  ) {}

  ngOnInit() {
    this.updateData();
  }

  public async updateData(callback?: () => void) {
    this.loaderModule.addRequirement();
    this.hasRepositoryAdminPermission = await this.authModule.hasPermission(
      'repositoryAdmin'
    );
    this.hasUserAdminPermission = await this.authModule.hasPermission(
      'userAdmin'
    );
    if (this.hasRepositoryAdminPermission) {
      this.cachedRepositories =
        await this.repositoriesModule.getAllRepositories();
      this.HTMLRepositories = _.cloneDeep(this.cachedRepositories);
    }
    for (let repo of this.HTMLRepositories) {
      repo.description = repo.description.replace('\n', '<br>');
    }

    this.cachedUsers = await this.authModule.getAllUsers();
    this.loaderModule.satisfyRequirement();
    if (callback) callback();
  }

  public editRepository(arrayID: number) {
    this.editedRepositories = _.cloneDeep(this.cachedRepositories); // Thos ensures that there is no reference between the two objects
    this.editingRepositoryID = arrayID;
  }

  public checkRepositoryEditInput() {
    if (this.editingRepositoryID === null) return;
    let repo = this.editedRepositories[this.editingRepositoryID];
    if (!repo.name) {
      this.repositoryEditingError = 'name-empty';
      return;
    } else {
      for (let repository of this.cachedRepositories) {
        if (repository.name == repo.name && repository.id !== repo.id) {
          this.repositoryEditingError = 'name-exists';
          return;
        }
      }
    }
    this.repositoryEditingError = null;
  }

  public checkRepositoryCreateInput() {
    if (!this.newRepositoryName) {
      this.repositoryEditingError = 'name-empty';
      return;
    } else {
      for (let repository of this.cachedRepositories) {
        if (repository.name == this.newRepositoryName) {
          this.repositoryEditingError = 'name-exists';
          return;
        }
      }
    }
    this.repositoryEditingError = null;
  }

  public async saveRepository() {
    if (this.repositoryEditingError || this.editingRepositoryID == null) return;
    let repo = this.editedRepositories[this.editingRepositoryID];
    await this.repositoriesModule.editRepository(
      repo.name,
      repo.description,
      repo.id
    );
    this.editingRepositoryID = null;
    this.updateData();
  }

  public updatePermissionUserSearchResults = async () => {
    if (this.editingRepositoryPermissionID === null) return;
    if (!this.permissionUserSearchString) {
      this.permissionUserSearchResults = [];
      return;
    }
    let results = [];
    for (let user of this.cachedUsers) {
      if (user.username.includes(this.permissionUserSearchString)) {
        for (let permission of this.cachedRepositories[
          this.editingRepositoryPermissionID
        ].permissions) {
          if (permission.User.id == user.id) {
            user.hasPermission = true;
            break;
          }
        }
        if (user.hasPermission === undefined) user.hasPermission = false;
        results.push(user);
      }
      if (results.length > 5) break; // This ensures that there are not more than 5 results shown.
    }
    this.permissionUserSearchResults = results;
  };

  public async revokeRepositoryPermission(userID: number) {
    if (this.modifingUserPermissions) return;
    this.modifingUserPermissions = true;
    if (this.editingRepositoryPermissionID === null) return;
    await this.repositoriesModule.revokeRepositoryPermission(
      userID,
      this.cachedRepositories[this.editingRepositoryPermissionID].id
    );
    await this.updateData();
    await this.updatePermissionUserSearchResults();
    this.modifingUserPermissions = false;
  }

  public async giveRepositoryPermission(userID: number) {
    if (this.modifingUserPermissions) return;
    this.modifingUserPermissions = true;
    if (this.editingRepositoryPermissionID === null) return;
    await this.repositoriesModule.giveRepositoryPermission(
      userID,
      this.cachedRepositories[this.editingRepositoryPermissionID].id
    );
    await this.updateData();
    await this.updatePermissionUserSearchResults();
    this.modifingUserPermissions = false;
  }

  public async createRepository() {
    if (this.repositoryEditingError !== null) return;
    if (this.creatingRepository) return;
    this.creatingRepository = true;

    this.loaderModule.addRequirement();
    if (!this.newRepositoryName) return;
    await this.repositoriesModule.createRepository(
      this.newRepositoryName,
      this.newRepositoryDescription
    );
    await this.updateData();
    this.loaderModule.satisfyRequirement();

    this.newRepositoryName = '';
    this.newRepositoryDescription = '';
    this.creatingRepository = false;
    this.showAddRepositoryOverlay = false;
  }
}
