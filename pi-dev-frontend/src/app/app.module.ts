import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MarketComponent } from './market/market.component';
import { BlogComponent } from './blog/blog.component';
import { EventComponent } from './event/event.component';
import { JobsComponent } from './jobs/jobs.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { FactureComponent } from './dashboard/livraison/factures/factures.component';
import { CreatelivraisonComponent } from './dashboard/livraison/createlivraison/createlivraison.component';
import { LivraisonComponent } from './dashboard/livraison/livraisons/livraisons.component';
import { CreatefactureComponent } from './dashboard/livraison/createfacture/createfacture.component';
import { SuiviLivraisonComponent } from './dashboard/livraison/suivilivraisons/suivilivraisons.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    NotFoundComponent,
    MarketComponent,
    BlogComponent,
    EventComponent,
    JobsComponent,
    ContactComponent,
    FactureComponent,
    LivraisonComponent,
    SuiviLivraisonComponent,
    CreatelivraisonComponent,
    CreatefactureComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardModule,
    CommonModule,
    RouterModule,
    DialogModule,
    BrowserAnimationsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permet l'utilisation de composants personnalisés
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}