import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MarketComponent } from './market/market.component';
import { BlogComponent } from './blog/blog.component';
import { EventComponent } from './event/event.component';
import { JobsComponent } from './jobs/jobs.component';
import { ContactComponent } from './contact/contact.component';


import { ServiceRequestsService } from './services/service-requests.service';
import { ServiceeService } from './services/servicee.service';
import { JobRequestsComponent } from './job-requests/job-requests.component';
import { DashboardRoutingModule } from './dashboard/dashboard-routing.module';
import { JobFormComponent } from './job-requests/job-form/job-form.component';
import { JobsRequestsDashboardComponent } from './dashboard/jobs-requests-dashboard/jobs-requests-dashboard.component';
import { DipslayComponent } from './dipslay/dipslay.component';
import { EmailJobsComponent } from './email-jobs/email-jobs.component';
   

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    NotFoundComponent,
    MarketComponent,
    BlogComponent,
    EventComponent,
    JobsComponent,
    ContactComponent,
    JobRequestsComponent,
    JobFormComponent,
    JobsRequestsDashboardComponent,
    DipslayComponent,
    EmailJobsComponent,
      
     ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardRoutingModule
  ],
  providers: [ServiceeService,ServiceRequestsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
