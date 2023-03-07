import { Component } from '@angular/core';
import { LoaderModule } from '../loader/loader.module';
import { AuthModule } from '../api/auth/auth.module';
import { RepositoriesModule } from '../api/repositories/repositories.module';
import { TranslationModule } from '../translation/translation.module';
import { SINVPermissions } from '../../../../backend/lib/auth/permissions';
import * as _ from 'lodash';
import {
  permissionObject,
  permission,
} from '../../../../backend/lib/auth/permissions.types';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
})
export class AdminSettingsComponent {
  // Repository administration properties
  public hasRepositoryAdminPermission: boolean = false;
  public hasUserAdminPermission: boolean = false;
  public cachedRepositories: any[] = [];
  public HTMLRepositories: any[] = [];
  public editedRepositories: any[] = [];
  public editingRepositoryID: number | null = null;
  public repositoryEditingError: 'name-empty' | 'name-exists' | null =
    'name-empty';
  public editingRepositoryPermissionID: number | null = null;
  public permissionUserSearchResults: any[] = [];
  public cachedUsers: any[] = [];
  public permissionUserSearchString: string = '';
  private modifingUserPermissions: boolean = false;
  public showAddRepositoryOverlay: boolean = false;
  public newRepositoryName: string = '';
  public newRepositoryDescription: string = '';
  private creatingRepository: boolean = false;

  // User administratino properties
  public users: any[] = [];
  public creatingNewUser: boolean = false;
  public newUserName: any = '';
  public showPasswordResetOverlay: boolean = false;
  public newUsernameValid: boolean = true;
  public passwordResetLink: string = '';
  public addingUser: boolean = false;
  public isNewUser: boolean = false;
  public changingPermissionUser: typeof this.users[number];
  public showManagePermissionOverlay: boolean = false;
  public SINVPermissions = SINVPermissions;
  public savingPermissions: boolean = false;

  public Object = Object;

  constructor(
    private loaderModule: LoaderModule,
    private authModule: AuthModule,
    public repositoriesModule: RepositoriesModule,
    public translationModule: TranslationModule
  ) {
    authModule.redirectIfNotLoggedIn('/login');
  }

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
    for (let user of this.cachedUsers) {
      user.permissions = SINVPermissions.permissionStringToObject(
        user.permissionString
      );
      user.specialPermissions = JSON.parse(user.permissionString);
    }
    this.users = this.cachedUsers;
    this.loaderModule.satisfyRequirement();
    if (callback) callback();
  }

  public editRepository(arrayID: number) {
    this.editedRepositories = _.cloneDeep(this.cachedRepositories); // Thos ensures that there is no reference between the two objects
    this.editingRepositoryID = arrayID;
    this.checkRepositoryEditInput();
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

  public async deleteRepository(id: number) {
    this.repositoriesModule.deleteRepository(id);
    await this.updateData();
  }

  public getPermissionDescription(user: any) {
    // This ensures that only the given permissions are listed and not all the defined ones.
    if (!user.specialPermissions) return null;
    let permissions = Object.keys(user.specialPermissions).filter((key) => {
      return user.specialPermissions[key] == true;
    });
    let returnValue = permissions.join(', ');
    return returnValue || null;
  }

  public async addUser() {
    if (!this.newUsernameValid) return;
    if (this.addingUser) return;
    this.addingUser = true;

    let resetID = await this.authModule.createUser(this.newUserName);
    this.newUserName = '';
    this.creatingNewUser = false;
    await this.updateData();
    this.isNewUser = true;
    this.passwordResetLink = this.authModule.getPasswordResetLink(resetID);
    this.showPasswordResetOverlay = true;

    this.addingUser = false;
  }

  public async resetPassword(userID: number) {
    this.loaderModule.addRequirement();
    this.passwordResetLink = this.authModule.getPasswordResetLink(
      await this.authModule.requestPasswordResetForOtherUser(userID)
    );
    this.isNewUser = false;
    this.showPasswordResetOverlay = true;
    this.loaderModule.satisfyRequirement();
  }

  public async validateUsername() {
    this.newUsernameValid = !(await this.authModule.userExists(
      this.newUserName
    ));
  }

  public copyPasswordResetLink() {
    navigator.clipboard.writeText(this.passwordResetLink);
  }

  public hasPermission(permissionName: string) {
    return SINVPermissions.hasPermission(
      this.changingPermissionUser.permissions,
      //@ts-ignore
      permissionName
    );
  }

  public permissionOverwritten(permission: any) {
    let permissionName = permission[0];
    let permissionValue = permission[1];
    return (
      (this.hasPermission('superuser') || !this.hasPermission('login')) &&
      !(['login', 'superuser'].includes(permissionName) && permissionValue)
    );
  }

  public async savePermissions() {
    if (this.savingPermissions) return;
    this.savingPermissions = true;
    let permissionString = SINVPermissions.permissionObjectToString(
      this.changingPermissionUser.permissions
    );
    await this.authModule.updateUserPermissions(
      this.changingPermissionUser.id,
      permissionString
    );
    await this.updateData();
    this.savingPermissions = false;
    this.showManagePermissionOverlay = false;
    this.changingPermissionUser = null;
  }
}
