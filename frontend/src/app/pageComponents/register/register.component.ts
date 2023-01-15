import { Component } from '@angular/core';
import { TranslationModule } from '../../translation/translation.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(public translationModule: TranslationModule) {}
}
