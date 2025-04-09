import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactureComponent } from './components/factures/factures.component';
import { LivraisonComponent } from './components/livraisons/livraisons.component';
import { CommonModule } from '@angular/common';
import { SuiviLivraisonComponent } from './components/suivilivraisons/suivilivraisons.component';

const routes : Routes = [
  //{ path:'', redirectTo:'home' , pathMatch:'full'},
  //{ path:'home' ,  component: HomeComponent},
  { path:'factures',  component: FactureComponent},
  { path:'factures/add/:id',  component: FactureComponent},
  { path:'livraisons',  component: LivraisonComponent},
  { path:'livraisons/add',  component: LivraisonComponent},
  { path:'livraisons/update/:id',  component: LivraisonComponent},
  { path:'livraisons/details/:id', component: LivraisonComponent},
  { path:'suivilivraison',  component: SuiviLivraisonComponent},

 // { path:'**', component: NotFoundComponent}, 
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
