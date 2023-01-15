import { Component } from '@angular/core';
import { TranslationModule } from '../../translation/translation.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(public translationModule: TranslationModule) {}
}
