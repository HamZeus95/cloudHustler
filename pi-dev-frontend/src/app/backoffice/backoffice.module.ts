import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { BillingComponent } from './components/billing/billing.component';
import { TablesComponent } from './components/tables/tables.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { PostBackComponent } from './components/post-back/post-back.component';
import { BlogManagmentComponent } from './pages/blog-managment/blog-managment.component';
import { CommentBackComponent } from './components/comment-back/comment-back.component';
import { StatsComponent } from './components/stats/stats.component';
import { NgChartsModule } from 'ng2-charts';




@NgModule({
  declarations: [
    //declarations of components
    //declarations of components

    PostBackComponent,
    SideBarComponent,
    BillingComponent,
    TablesComponent,
    NavbarComponent,
    SettingsPanelComponent,

    //declarations of pages
    BlogManagmentComponent,
      CommentBackComponent,
      StatsComponent
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,

  ]
  
  //styles



})
export class BackofficeModule { }
