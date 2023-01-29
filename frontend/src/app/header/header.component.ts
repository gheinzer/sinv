import { Component } from '@angular/core';
import { LoaderModule } from '../loader/loader.module';
import { AuthModule } from '../api/auth/auth.module';
import { RepositoriesModule } from '../api/repositories/repositories.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private repositoryList: { name: string; id: number }[] = [];
  public repositories: { [key: number]: string } = [];

  constructor(
    public authModule: AuthModule,
    private repoModule: RepositoriesModule,
    private loaderModule: LoaderModule
  ) {}

  async ngOnInit() {
    this.loaderModule.addRequirement();
    await this.authModule.awaitAuthentication();
    if (this.authModule.isAuthenticated) {
      this.repositoryList = await this.repoModule.getUserRepositories();
      for (let repo of this.repositoryList) {
        this.repositories[repo.id] = repo.name;
      }
    }

    this.loaderModule.satisfyRequirement();
  }
}
