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
import { WsModule } from './api/ws/ws.module';
import { AuthModule } from './api/auth/auth.module';
import { APIModule } from './api/api/api.module';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';
import { IconTextComponent } from './icon-text/icon-text.component';
import { LoaderModule } from './loader/loader.module';
import { UserBadgeComponent } from './user-badge/user-badge.component';
import { ObjectCreatorComponet } from './objects/creator/creator.component';
import { RepositoriesModule } from './api/repositories/repositories.module';
import { KeyboardShortcutComponent } from './keyboard-shortcut/keyboard-shortcut.component';
import { KeyboardShortcutDirective } from './keyboard-shortcut.directive';
import { AttachmentModule } from './api/attachments/attachments.module';
import { AttachmentEditorComponent } from './attachments/attachment-editor/attachment-editor.component';
import { AttachmentDropZoneComponent } from './attachments/attachment-drop-zone/attachment-drop-zone.component';
import { FileIconModule } from './attachments/file-icon/file-icon.module';
import { RepoSettingsComponent } from './repo-settings/repo-settings.component';
import { WindowOverlayComponent } from './window-overlay/window-overlay.component';

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
    LoaderComponent,
    IconTextComponent,
    UserBadgeComponent,
    ObjectCreatorComponet,
    KeyboardShortcutComponent,
    KeyboardShortcutDirective,
    AttachmentEditorComponent,
    AttachmentDropZoneComponent,
    RepoSettingsComponent,
    WindowOverlayComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    TranslationModule,
    WsModule,
    AuthModule,
    APIModule,
    LoaderModule,
    RepositoriesModule,
    AttachmentModule,
    FileIconModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
