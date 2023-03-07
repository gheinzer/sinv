import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from '../api/api.module';
import { Router } from '@angular/router';
import { LoaderModule } from '../../loader/loader.module';
import { AuthenticationData } from '../../../../../backend/lib/api/api.types';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class AuthModule {
  private readonly sessionIDCookieName: string = 'sinv-sessid';
  private authValidationHandlers: (() => void)[] = [];
  private authenticationStateChecked: boolean = false;
  public isAuthenticated: boolean = false;

  constructor(
    private apiModule: APIModule,
    private router: Router,
    private loaderModule: LoaderModule
  ) {}

  public authenticationData: AuthenticationData = {
    isAuthenticated: false,
  };

  private async updateAuthenticationData() {
    await this.apiModule.call('apiHandler/updateAuthenticationData', {
      auth: this.authenticationData,
    });
  }

  public async updateAuthenticationState() {
    this.loaderModule.addRequirement();
    let sessionID = window.localStorage.getItem(this.sessionIDCookieName);
    if (sessionID) {
      let sessionValid = (
        await this.apiModule.call('auth/validateSession', {
          sessionID,
        })
      ).data.isValid;
      if (sessionValid) {
        this.authenticationData = { isAuthenticated: true, sessionID };
      } else {
        this.logout();
      }
    } else {
      this.authenticationData = {
        isAuthenticated: false,
      };
    }
    this.updateAuthenticationData();
    this.authenticationStateChecked = true;
    for (let handler of this.authValidationHandlers) {
      handler();
    }
    this.isAuthenticated = this.authenticationData.isAuthenticated;
    this.loaderModule.satisfyRequirement();
  }

  public async login(username: string, password: string) {
    let sessionData = await this.apiModule.call('auth/login', {
      username,
      password,
    });
    window.localStorage.setItem(
      this.sessionIDCookieName,
      sessionData.data.sessionID
    );
    this.authenticationData = {
      sessionID: sessionData.data.sessionID,
      isAuthenticated: true,
    };
    this.updateAuthenticationState();
  }

  public async userExists(username: string) {
    return (
      await this.apiModule.call('auth/userExists', {
        username,
      })
    ).data?.userExists;
  }

  public awaitAuthentication() {
    if (this.authenticationStateChecked) return;
    return new Promise<void>((resolve, reject) => {
      this.authValidationHandlers.push(resolve);
    });
  }

  public async redirectIfLoggedIn(url: string) {
    await this.awaitAuthentication();
    if (this.authenticationData.isAuthenticated) {
      this.router.navigateByUrl(url);
    }
  }

  public async redirectIfNotLoggedIn(url: string) {
    await this.awaitAuthentication();
    if (!this.authenticationData.isAuthenticated) {
      this.router.navigateByUrl(url);
    }
  }

  public async getUsername() {
    await this.awaitAuthentication();
    if (!this.authenticationData.isAuthenticated) return '';
    return (await this.apiModule.call('auth/getUsername', {})).data.username;
  }

  public async logout() {
    await this.awaitAuthentication();
    if (!this.authenticationData.isAuthenticated) return;
    window.localStorage.removeItem(this.sessionIDCookieName);
    await this.apiModule.call('auth/logout', {});
    this.updateAuthenticationState();
    window.location.reload();
  }

  public async hasPermission(permissionName: string) {
    await this.awaitAuthentication();
    return (await this.apiModule.call('auth/hasPermission', { permissionName }))
      .data.hasPermission;
  }

  public async getAllUsers() {
    await this.awaitAuthentication();
    return (await this.apiModule.call('auth/getUsers', {})).data.users;
  }

  public async createUser(username: string) {
    await this.awaitAuthentication();
    return (await this.apiModule.call('auth/createUser', { username })).data
      .passwordResetRequestID;
  }

  public async requestPasswordResetForOtherUser(userID: number) {
    await this.awaitAuthentication();
    return (
      await this.apiModule.call('auth/requestPasswordResetForOtherUser', {
        userID,
      })
    ).data.passwordResetRequestID;
  }

  public async updateUserPermissions(userID: number, permissionString: string) {
    await this.awaitAuthentication();
    await this.apiModule.call('auth/updatePermissions', {
      userID,
      permissionString,
    });
  }

  public getPasswordResetLink(resetID: string) {
    return `${window.location.protocol.replace(':', '')}://${
      window.location.host
    }/passwordreset/${resetID}`;
  }

  public async deleteUser(userID: number) {
    await this.apiModule.call('auth/deleteUser', {
      userID,
    });
  }
}
