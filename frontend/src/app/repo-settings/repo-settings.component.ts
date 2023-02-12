import { Component } from '@angular/core';
import { APIModule } from '../api/api/api.module';
import { RepositoriesModule } from '../api/repositories/repositories.module';
import { AuthModule } from '../api/auth/auth.module';
import { LoaderModule } from '../loader/loader.module';
import { TranslationModule } from '../translation/translation.module';

@Component({
  selector: 'app-repo-settings',
  templateUrl: './repo-settings.component.html',
  styleUrls: ['./repo-settings.component.scss'],
})
export class RepoSettingsComponent {
  public categories: { id: number; name: string }[] = [];
  public addCategory: boolean = false;
  public windowOverlayLoader: boolean = false;
  public newCategoryName: string = '';

  constructor(
    private apiModule: APIModule,
    private repositoriesModule: RepositoriesModule,
    private authModule: AuthModule,
    private loaderModule: LoaderModule,
    public translationModule: TranslationModule
  ) {}

  private getCategories = async () => {
    this.loaderModule.addRequirement();
    await this.authModule.awaitAuthentication();
    await this.repositoriesModule.awaitInitialization();
    this.categories = await this.repositoriesModule.getRepositoryCategories();
    this.loaderModule.satisfyRequirement();
  };

  ngOnInit() {
    this.getCategories();
    this.repositoriesModule.addRepositoryUpdateCallback(this.getCategories);
  }

  async deleteCategory(id: number) {
    await this.repositoriesModule.deleteCategory(id);
    await this.getCategories();
  }

  async createCategory() {
    if (this.windowOverlayLoader) return;
    this.windowOverlayLoader = true;
    await this.repositoriesModule.createCategory(this.newCategoryName);
    this.addCategory = false;
    this.newCategoryName = '';
    this.windowOverlayLoader = false;
  }

  async saveCategory(id: number) {
    let categoryName = '';
    for (let category of this.categories) {
      if (category.id == id) {
        categoryName = category.name;
        break;
      }
    }
    await this.repositoriesModule.changeCategoryName(id, categoryName);
  }
}
