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
import { TranslationComponent } from './translation/translation.component';
import { TranslationModule } from './translation/translation.module';
import { ButtonComponent } from './button/button.component';
import { RegisterComponent } from './pageComponents/register/register.component';
import { WsModule } from './api/ws/ws.module';
import { AuthModule } from './api/auth/auth.module';
import { APIModule } from './api/api/api.module';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    HeaderComponent,
    LinkComponent,
    HomeComponent,
    FooterComponent,
    NotFoundComponent,
    LoginComponent,
    InputComponent,
    IconComponent,
    BannerComponent,
    TranslationComponent,
    ButtonComponent,
    RegisterComponent,
    LoaderComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [TranslationModule, WsModule, AuthModule, APIModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
