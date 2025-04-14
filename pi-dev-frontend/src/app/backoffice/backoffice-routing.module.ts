import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostService } from '../core/services/service';
import { BlogManagmentComponent } from './pages/blog-managment/blog-managment.component';
import { BillingComponent } from './components/billing/billing.component';
import { PostBackComponent } from './components/post-back/post-back.component';


const routes: Routes = [

  { path: '', component:BlogManagmentComponent},
  { path: 'blog', component: BlogManagmentComponent },

  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PostService,]
})
export class BackofficeRoutingModule { }
