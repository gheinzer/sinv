import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationData } from '@sinv/backend/lib/api/api.types';
import { APIModule } from '../api/api.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class AuthModule {
  private readonly sessionIDCookieName: string = 'sinv-sessid';

  constructor(private apiModule: APIModule) {}

  private authenticationData: AuthenticationData = {
    isAuthenticated: false,
  };

  private async updateAuthenticationData() {
    await this.apiModule.call('apiHandler/updateAuthenticationData', {
      auth: this.authenticationData,
    });
  }

  public async updateAuthenticationState() {
    let sessionID = window.localStorage.getItem(this.sessionIDCookieName);
    if (sessionID) {
      let sessionValid = (
        await this.apiModule.call('auth/validateSession', {
          sessionID,
        })
      ).data.isValid;
      if (sessionValid) {
        this.authenticationData = { isAuthenticated: true, sessionID };
        this.updateAuthenticationData();
        console.log(this.authenticationData);
        return;
      }
    }
    this.authenticationData = {
      isAuthenticated: false,
    };
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
}
