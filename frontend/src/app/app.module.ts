import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogoComponent } from './logo/logo.component';
import { HeaderComponent } from './header/header.component';
import { LinkComponent } from './link/link.component';
import { HomeComponent } from './pageComponents/home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './pageComponents/not-found/not-found.component';
import { LoginComponent } from './pageComponents/login/login.component';
import { InputComponent } from './input/input.component';
import { IconComponent } from './icon/icon.component';
import { BannerComponent } from './banner/banner.component';

@NgModule({
  declarations: [AppComponent, LogoComponent, HeaderComponent, LinkComponent, HomeComponent, FooterComponent, NotFoundComponent, LoginComponent, InputComponent, IconComponent, BannerComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
