import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationData } from '@sinv/backend/lib/api/api.types';
import { APIModule } from '../api/api.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class AuthModule {
  constructor(private apiModule: APIModule) {}

  private authenticationData: AuthenticationData = {
    isAuthenticated: false,
  };

  private async updateAuthenticationData() {
    await this.apiModule.call('apiHandler/updateAuthenticationData', {
      auth: this.authenticationData,
    });
  }

  public async userExists(username: string) {
    return (
      await this.apiModule.call('auth/userExists', {
        username,
      })
    ).data?.userExists;
  }
}
