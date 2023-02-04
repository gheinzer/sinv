import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoaderModule } from '../loader/loader.module';
import { AuthModule } from '../api/auth/auth.module';
import { RepositoriesModule } from '../api/repositories/repositories.module';
import { TranslationModule } from '../translation/translation.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public readonly lastRepoCookieName: string = 'sinv-last-repo-id';

  private repositoryList: { name: string; id: number }[] = [];
  public repositories: { [key: number]: string } = [];
  public selectedRepository: any = 0;

  @ViewChild('search') searchInput!: ElementRef;
  @ViewChild('idsearch') IDSsearchInput!: ElementRef;

  constructor(
    public authModule: AuthModule,
    private repoModule: RepositoriesModule,
    private loaderModule: LoaderModule,
    public translationModule: TranslationModule
  ) {}

  async ngOnInit() {
    this.loaderModule.addRequirement();
    await this.authModule.awaitAuthentication();
    let lastRepo = window.localStorage.getItem(this.lastRepoCookieName);
    if (this.authModule.isAuthenticated) {
      this.repositoryList = await this.repoModule.getUserRepositories();
      for (let repo of this.repositoryList) {
        this.repositories[repo.id] = repo.name;
      }
    }
    this.loaderModule.satisfyRequirement();
    if (lastRepo) this.selectedRepository = parseInt(lastRepo);
    else this.selectedRepository = this.repositoryList[0].id;
    this.updateRepository();
  }
  async updateRepository() {
    window.localStorage.setItem(
      this.lastRepoCookieName,
      this.selectedRepository
    );
  }

  public focusSearch = () => {
    //@ts-ignore
    this.searchInput.input.nativeElement.focus();
  };
}
