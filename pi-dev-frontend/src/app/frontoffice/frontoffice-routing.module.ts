import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EventComponent } from './components/event/event.component';


const routes: Routes = [
    { path:"event" , component:EventComponent},
    { path: '', component:HomeComponent }
    
]
   








@NgModule({
    imports: [
      
      RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class FrontofficeRoutingModule { }