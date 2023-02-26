import { Component, ViewEncapsulation } from '@angular/core';
import { APIModule } from '../api/api/api.module';
import { LoaderModule } from '../loader/loader.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocsComponent {
  public docsHTML = '';

  constructor(
    private apiModule: APIModule,
    private loaderModule: LoaderModule,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe(async (val) => {
      this.docsHTML = (
        await this.apiModule.call('docs/getHTML', { path: val['docsPath'] })
      ).data.html;
    });
  }

  ngOnInit() {}
}
