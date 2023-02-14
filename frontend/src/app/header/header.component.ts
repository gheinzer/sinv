import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LoaderModule } from '../loader/loader.module';
import { AuthModule } from '../api/auth/auth.module';
import { RepositoriesModule } from '../api/repositories/repositories.module';
import { TranslationModule } from '../translation/translation.module';
import { BarcodeScannerService } from '../barcode-scanner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @ViewChild('search') searchInput!: ElementRef;
  private maxIdentifierLength: number = 1;
  public idSearchValue: string = '';
  public searchValue: string = '';

  constructor(
    public authModule: AuthModule,
    public repoModule: RepositoriesModule,
    private loaderModule: LoaderModule,
    public translationModule: TranslationModule,
    barcodeScannerService: BarcodeScannerService,
    private router: Router
  ) {
    barcodeScannerService.addHandler(this.searchForID);
  }

  async ngOnInit() {
    await this.authModule.awaitAuthentication();
    if (this.authModule.authenticationData.isAuthenticated) {
      this.loaderModule.addRequirement();
      this.maxIdentifierLength = await this.repoModule.getMaxIdentifierLength();
      this.loaderModule.satisfyRequirement();
    }
  }

  public focusSearch = () => {
    //@ts-ignore
    this.searchInput.input.nativeElement.focus();
  };

  public textSearch() {
    this.router.navigateByUrl('/search/text/' + this.searchValue);
  }

  public searchForID = (id: string) => {
    this.idSearchValue = id;
    this.router.navigateByUrl('/search/id/' + id);
  };

  public idSearchOnChange(value: string) {
    if (value.length >= this.maxIdentifierLength) {
      this.searchForID(value);
    }
  }
}
