import { Component } from '@angular/core';
import { TranslationModule } from '../../translation/translation.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(public translationModule: TranslationModule) {}

  public username: string = '';
  public password: string = '';
  public submitDisabled: boolean = true;

  public checkValues() {
    let requirementsSatisfied: boolean = true;
    if (this.password == '') requirementsSatisfied = false;
    else if (this.username == '') requirementsSatisfied = false;
    this.submitDisabled = !requirementsSatisfied;
    console.log(this.submitDisabled, requirementsSatisfied);
  }
}
