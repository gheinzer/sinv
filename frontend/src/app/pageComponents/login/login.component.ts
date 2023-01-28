import { Component, OnInit } from '@angular/core';
import { TranslationModule } from '../../translation/translation.module';
import { AuthModule } from '../../api/auth/auth.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public translationModule: TranslationModule,
    public authenticationModule: AuthModule
  ) {}

  public username: string = '';
  public password: string = '';
  public submitDisabled: boolean = true;
  public loginLoading: boolean = false;
  public userExists: boolean = true;
  public passwordWrong: boolean = false;

  public async checkValues() {
    this.loginLoading = true;
    let requirementsSatisfied: boolean = true;
    this.userExists = await this.authenticationModule.userExists(this.username);
    if (this.password == '') requirementsSatisfied = false;
    else if (this.username == '') requirementsSatisfied = false;
    else if (!this.userExists) {
      requirementsSatisfied = false;
    }
    this.submitDisabled = !requirementsSatisfied;
    this.loginLoading = false;
  }

  public async login() {
    if (this.submitDisabled) return;
    this.loginLoading = true;
    try {
      await this.authenticationModule.login(this.username, this.password);
      this.passwordWrong = false;
    } catch (err: any) {
      if (err.message == 'wrong_password') {
        this.passwordWrong = true;
        this.password = '';
      }
    }
    this.loginLoading = false;
  }

  ngOnInit() {
    this.authenticationModule.redirectIfLoggedIn('/');
  }
}
