import { Component } from '@angular/core';
import { TranslationModule } from '../../translation/translation.module';
import { AuthModule } from '../../api/auth/auth.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    public translationModule: TranslationModule,
    public authenticationModule: AuthModule
  ) {}

  public username: string = '';
  public password: string = '';
  public submitDisabled: boolean = true;
  public checkingRequirements: boolean = false;
  public userExists: boolean = true;

  public async checkValues() {
    this.checkingRequirements = true;
    let requirementsSatisfied: boolean = true;
    this.userExists = await this.authenticationModule.userExists(this.username);
    if (this.password == '') requirementsSatisfied = false;
    else if (this.username == '') requirementsSatisfied = false;
    else if (!this.userExists) {
      requirementsSatisfied = false;
    }
    this.submitDisabled = !requirementsSatisfied;
    this.checkingRequirements = false;
  }
}
