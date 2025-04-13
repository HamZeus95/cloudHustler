import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'backoffice',
    loadChildren: () => import('./backoffice/backoffice.module').then(m => m.BackofficeModule)
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