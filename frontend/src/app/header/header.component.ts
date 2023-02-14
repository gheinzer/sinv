import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LoaderModule } from '../loader/loader.module';
import { AuthModule } from '../api/auth/auth.module';
import { RepositoriesModule } from '../api/repositories/repositories.module';
import { TranslationModule } from '../translation/translation.module';
import { BarcodeScannerService } from '../barcode-scanner.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  public identifierDoesNotExist: boolean = false;

  constructor(
    public authModule: AuthModule,
    public repoModule: RepositoriesModule,
    private loaderModule: LoaderModule,
    public translationModule: TranslationModule,
    barcodeScannerService: BarcodeScannerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    barcodeScannerService.addHandler(this.searchForID);
  }
  public focusSearch = () => {
    //@ts-ignore
    this.searchInput.input.nativeElement.focus();
  };

  public textSearch() {
    if (this.searchValue == '') {
      this.router.navigateByUrl('/');
      return;
    }
    this.router.navigateByUrl('/search/text/' + this.searchValue);
  }

  public searchForID = async (id: string) => {
    this.idSearchValue = id;
    this.identifierDoesNotExist = !(await this.repoModule.identifierExists(
      this.idSearchValue
    ));

    if (!this.identifierDoesNotExist) {
      this.router.navigateByUrl('/object/view/' + this.idSearchValue);
      this.idSearchValue = '';
    }
  };
}
