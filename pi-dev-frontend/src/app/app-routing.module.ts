import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'farms',
    loadChildren: () => import('./farms/farms.module').then(m => m.FarmsModule)
  },
  {
    path: '',
    redirectTo: '/farms',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
