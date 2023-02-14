import { Component } from '@angular/core';
import { AuthModule } from './api/auth/auth.module';
import { LoaderModule } from './loader/loader.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public loaded: boolean = false;

  constructor(
    private authModule: AuthModule,
    private loaderModule: LoaderModule
  ) {
    loaderModule.onchange((loaded) => {
      this.loaded = loaded;
    });
    loaderModule.addRequirement();
    window.onload = () => loaderModule.satisfyRequirement();
  }

  async ngOnInit() {
    await this.authModule.updateAuthenticationState();
  }
}
