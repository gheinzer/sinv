import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslationModule } from '../translation/translation.module';
import { AuthModule } from '../api/auth/auth.module';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  private requestID: string = '';
  public savingPassword: boolean = false;
  public passwordsValid: boolean = false;
  public passwordRepeatWrong: boolean = false;

  public newPassword: string = '';
  public newPasswordRepetition: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    public translationModule: TranslationModule,
    private authModule: AuthModule
  ) {
    authModule.redirectIfLoggedIn('/');
    activatedRoute.paramMap.subscribe((value) => {
      this.requestID = value.get('resetID') ?? '';
    });
  }

  public validatePassword() {
    this.passwordsValid =
      this.newPassword == this.newPasswordRepetition &&
      this.newPassword !== '' &&
      this.newPasswordRepetition !== '';

    this.passwordRepeatWrong =
      this.newPassword !== this.newPasswordRepetition &&
      this.newPassword !== '' &&
      this.newPasswordRepetition !== '';
  }

  public async changePasswords() {
    if (this.passwordRepeatWrong || !this.passwordsValid || this.savingPassword)
      return;
    this.savingPassword = true;

    await this.authModule.resetPassword(this.requestID, this.newPassword);

    this.savingPassword = false;
    window.location.pathname = '/';
  }
}
