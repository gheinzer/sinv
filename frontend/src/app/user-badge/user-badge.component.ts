import { Component, OnInit } from '@angular/core';
import { AuthModule } from '../api/auth/auth.module';
import { LoaderModule } from '../loader/loader.module';

@Component({
  selector: 'app-user-badge',
  templateUrl: './user-badge.component.html',
  styleUrls: ['./user-badge.component.scss'],
})
export class UserBadgeComponent implements OnInit {
  public username: string = '';
  public hasAdminPermissions: boolean = false;

  constructor(
    public authModule: AuthModule,
    private loaderModule: LoaderModule
  ) {}

  async ngOnInit() {
    this.loaderModule.addRequirement();
    this.username = await this.authModule.getUsername();

    this.hasAdminPermissions =
      (await this.authModule.hasPermission('repositoryAdmin')) ||
      (await this.authModule.hasPermission('userAdmin'));
    this.loaderModule.satisfyRequirement();
  }
}
