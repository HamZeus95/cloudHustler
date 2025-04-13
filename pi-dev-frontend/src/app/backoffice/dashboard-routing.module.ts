import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostService } from '../core/services/service';
import { BlogManagmentComponent } from './pages/blog-managment/blog-managment.component';


const routes: Routes = [

  { path: '', component: BlogManagmentComponent },

  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PostService,]
})
export class BackofficeRoutingModule { }
