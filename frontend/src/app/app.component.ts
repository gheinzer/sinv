import { Component } from '@angular/core';
import { AuthModule } from './api/auth/auth.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authModule: AuthModule) {}

  async ngOnInit() {
    await this.authModule.updateAuthenticationState();
  }

  title = 'frontend';
}
