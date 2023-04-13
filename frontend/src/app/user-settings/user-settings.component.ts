import { Component } from '@angular/core';
import { TranslationModule } from '../translation/translation.module';
import { AuthModule } from '../api/auth/auth.module';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent {
  public newPassword: string = '';
  public newPasswordRepeat: string = '';
  public allowSavingPassword: boolean = false;
  public savingPassword: boolean = false;

  constructor(
    public translationModule: TranslationModule,
    private authModule: AuthModule
  ) {}

  public validatePasswords() {
    this.allowSavingPassword =
      this.newPassword == this.newPasswordRepeat && this.newPassword !== '';
  }

  public async savePassword() {
    if (!this.allowSavingPassword || this.savingPassword) return;
    this.savingPassword = true;

    await this.authModule.changePassword(this.newPassword);

    this.savingPassword = false;
    this.newPassword = '';
    this.newPasswordRepeat = '';
  }
}
