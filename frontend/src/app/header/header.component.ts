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
  @ViewChild('search') searchInput!: ElementRef;
  @ViewChild('idsearch') IDSsearchInput!: ElementRef;

  constructor(
    public authModule: AuthModule,
    public repoModule: RepositoriesModule,
    private loaderModule: LoaderModule,
    public translationModule: TranslationModule
  ) {}

  async ngOnInit() {}

  public focusSearch = () => {
    //@ts-ignore
    this.searchInput.input.nativeElement.focus();
  };
}
