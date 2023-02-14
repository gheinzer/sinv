import { Component, OnChanges } from '@angular/core';
import { RepositoriesModule } from '../../api/repositories/repositories.module';
import { LoaderModule } from '../../loader/loader.module';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResult } from '../../../../../backend/lib/objects/repositories.types';

@Component({
  selector: 'app-text-search',
  templateUrl: './text-search.component.html',
  styleUrls: ['./text-search.component.scss'],
})
export class TextSearchComponent {
  public searchString = '';
  public results: SearchResult[] = [];
  public resultsLoading: boolean = true;

  constructor(
    private repositoriresModule: RepositoriesModule,
    private loaderModule: LoaderModule,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.paramMap.subscribe((value) => {
      this.searchString = value.get('searchString') ?? '';
      this.updateResults();
    });
  }

  ngOnChanges() {
    this.resultsLoading = true;
  }

  private async updateResults() {
    this.results = await this.repositoriresModule.textSearch(this.searchString);
    this.resultsLoading = false;
  }

  public openResult(identifier: String) {
    this.router.navigateByUrl('/object/view/' + identifier);
  }
}
