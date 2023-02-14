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

  constructor(
    public authModule: AuthModule,
    private loaderModule: LoaderModule
  ) {}

  async ngOnInit() {
    this.loaderModule.addRequirement();
    this.username = await this.authModule.getUsername();
    this.loaderModule.satisfyRequirement();
  }
}
