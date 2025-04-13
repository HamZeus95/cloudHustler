import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EventComponent } from './pages/event/event.component';
import { HomeComponent } from './pages/home/home.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { MarketComponent } from './pages/market/market.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    AboutComponent,
    BlogComponent,
    ContactComponent,
    EventComponent,
    HomeComponent,
    JobsComponent,
    MarketComponent,
    NotFoundComponent

  ],
  imports: [
    CommonModule,
    FrontofficeRoutingModule
  ]
})
export class FrontofficeModule { }
