import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationData } from '@sinv/backend/lib/api/api.types';
import { APIModule } from '../api/api.module';
import { Router } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class AuthModule {
  private readonly sessionIDCookieName: string = 'sinv-sessid';
  private authValidationHandlers: (() => void)[] = [];
  private authenticationStateChecked: boolean = false;

  constructor(private apiModule: APIModule, private router: Router) {}

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
      } else {
        this.authenticationData = {
          isAuthenticated: false,
        };
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

  private awaitAuthentication() {
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
}
