import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import AuthGuard correctly with the default import
import AuthGuard from './auth/guards/auth.guard';
import { OAuth2RedirectComponent } from './auth/oauth2/oauth2-redirect.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'oauth2/redirect',
    component: OAuth2RedirectComponent
  },

  {
    path: 'backoffice',
    loadChildren: () => import('./backoffice/backoffice.module').then(m => m.BackofficeModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'frontoffice',
    loadChildren: () => import('./frontoffice/frontoffice.module').then(m => m.FrontofficeModule)
  },

  {path: '',redirectTo: 'frontoffice',pathMatch: 'full'},
  {path: '**', redirectTo: 'not-found'},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
