import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIModule } from '../api/api.module';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class RepositoriesModule {
  constructor(private apiModule: APIModule, private authModule: AuthModule) {}

  public async getUserRepositories(): Promise<{ name: string; id: number }[]> {
    await this.authModule.awaitAuthentication();
    let reponse = await this.apiModule.call('repo/getRepositories', {});
    return reponse.data.repositories;
  }
}
