import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pageComponents/home/home.component';
import { NotFoundComponent } from './pageComponents/not-found/not-found.component';
import { LoginComponent } from './pageComponents/login/login.component';
import { ObjectCreatorComponet } from './objects/creator/creator.component';
import { RepoSettingsComponent } from './repo-settings/repo-settings.component';
import { ObjectViewerComponent } from './objects/viewer/viewer.component';
import { TextSearchComponent } from './search/text-search/text-search.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'object/new',
    component: ObjectCreatorComponet,
  },
  {
    path: 'object/view/:objectIdentifier',
    component: ObjectViewerComponent,
  },
  {
    path: 'repo-settings',
    component: RepoSettingsComponent,
  },
  {
    path: 'admin-settings',
    component: AdminSettingsComponent,
  },
  {
    path: 'search/text/:searchString',
    component: TextSearchComponent,
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
